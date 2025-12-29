import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:inventory_app/core/widgets/glass_container.dart';
import 'package:inventory_app/features/inventory/domain/entities/item.dart';
import 'package:inventory_app/features/inventory/presentation/providers/inventory_provider.dart';
import 'package:uuid/uuid.dart';

class ToDoListScreen extends ConsumerWidget {
  const ToDoListScreen({super.key});

  void _showAddDialog(BuildContext context, WidgetRef ref) {
    final TextEditingController controller = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        child: GlassContainer(
          opacity: 0.2,
          blur: 15,
          borderRadius: BorderRadius.circular(20),
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'New Task',
                style: TextStyle(
                    color: Theme.of(context).colorScheme.onSurface,
                    fontSize: 22,
                    fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              TextField(
                controller: controller,
                style:
                    TextStyle(color: Theme.of(context).colorScheme.onSurface),
                decoration: InputDecoration(
                  hintText: 'What needs to be done?',
                  hintStyle: TextStyle(
                      color: Theme.of(context)
                          .colorScheme
                          .onSurface
                          .withOpacity(0.5)),
                  enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(
                          color: Theme.of(context)
                              .colorScheme
                              .onSurface
                              .withOpacity(0.3))),
                  focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(
                          color: Theme.of(context).colorScheme.primary)),
                ),
              ),
              const SizedBox(height: 24),
              FilledButton(
                style: FilledButton.styleFrom(
                  backgroundColor: const Color(0xFF006C5B),
                  foregroundColor: Colors.white,
                ),
                onPressed: () {
                  if (controller.text.isNotEmpty) {
                    final newItem = Item(
                      id: const Uuid().v4(),
                      name: controller.text,
                      category: 'General',
                      unit: 'units',
                      status: ItemStatus.todo,
                      quantity: 1,
                    );
                    ref.read(inventoryProvider.notifier).addItem(newItem);
                    Navigator.pop(context);
                  }
                },
                child: const Text('Add Task'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _moveItem(
      BuildContext context, WidgetRef ref, Item item, ItemStatus newStatus) {
    final updated = item.copyWith(
      status: newStatus,
      isBought: false,
    );
    ref.read(inventoryProvider.notifier).updateItem(updated);

    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(
          'Moved to ${newStatus == ItemStatus.available ? "Inventory" : "Shopping List"}'),
      backgroundColor: const Color(0xFF006C5B),
    ));
  }

  void _deleteItem(WidgetRef ref, String id) {
    ref.read(inventoryProvider.notifier).deleteItem(id);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final inventoryState = ref.watch(inventoryProvider);

    return Scaffold(
      backgroundColor: Colors.transparent,
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddDialog(context, ref),
        backgroundColor: const Color(0xFF006C5B),
        child: const Icon(Icons.add_task, color: Colors.white),
      ),
      body: inventoryState.when(
        data: (items) {
          final todoItems =
              items.where((i) => i.status == ItemStatus.todo).toList();

          if (todoItems.isEmpty) {
            return Center(
              child: Text(
                'No tasks yet. Relax! \u2615',
                style: TextStyle(
                    color: Theme.of(context)
                        .colorScheme
                        .onSurface
                        .withOpacity(0.7),
                    fontSize: 16),
              ),
            );
          }
          return ListView.builder(
            padding: const EdgeInsets.only(
                top: 100, bottom: 80, left: 16, right: 16),
            itemCount: todoItems.length,
            itemBuilder: (context, index) {
              final item = todoItems[index];
              return Dismissible(
                key: Key(item.id),
                background: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  decoration: BoxDecoration(
                    color: Colors.redAccent.withValues(alpha: 0.8),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  alignment: Alignment.centerRight,
                  padding: const EdgeInsets.only(right: 20),
                  child: const Icon(Icons.delete_outline,
                      color: Colors.white, size: 30),
                ),
                direction: DismissDirection.endToStart,
                onDismissed: (_) => _deleteItem(ref, item.id),
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: GlassContainer(
                    opacity: 0.1,
                    blur: 10,
                    borderRadius: BorderRadius.circular(16),
                    child: ExpansionTile(
                      iconColor: Theme.of(context).colorScheme.onSurface,
                      collapsedIconColor: Theme.of(context)
                          .colorScheme
                          .onSurface
                          .withOpacity(0.7),
                      leading: Icon(Icons.circle_outlined,
                          color: Theme.of(context)
                              .colorScheme
                              .onSurface
                              .withOpacity(0.6)),
                      title: Text(
                        item.name,
                        style: TextStyle(
                            color: Theme.of(context).colorScheme.onSurface,
                            fontWeight: FontWeight.w600,
                            fontSize: 16),
                      ),
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              _ActionButton(
                                icon: Icons.inventory_2_outlined,
                                label: 'To Inventory',
                                onTap: () => _moveItem(
                                    context, ref, item, ItemStatus.available),
                              ),
                              _ActionButton(
                                icon: Icons.shopping_cart_outlined,
                                label: 'To Shopping',
                                onTap: () => _moveItem(
                                    context, ref, item, ItemStatus.needToBuy),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          );
        },
        loading: () => const Center(
            child: CircularProgressIndicator(color: Color(0xFF006C5B))),
        error: (e, st) => Center(
            child: Text('Error: $e',
                style: const TextStyle(color: Colors.redAccent))),
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _ActionButton(
      {required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? Colors.white : const Color(0xFF2C3E50);
    final hintColor = isDark ? Colors.white54 : Colors.black45;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isDark
              ? Colors.white.withValues(alpha: 0.1)
              : Colors.black.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isDark ? Colors.white24 : Colors.black12),
        ),
        child: Column(
          children: [
            Icon(icon, color: textColor, size: 24),
            const SizedBox(height: 8),
            Text(label, style: TextStyle(color: hintColor, fontSize: 12)),
          ],
        ),
      ),
    );
  }
}
