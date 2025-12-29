import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:inventory_app/features/inventory/domain/entities/item.dart';
import 'package:inventory_app/features/inventory/presentation/providers/inventory_provider.dart';
import 'package:inventory_app/features/inventory/presentation/screens/add_item_sheet.dart';
import 'package:inventory_app/core/widgets/glass_container.dart';

class InventoryScreen extends ConsumerWidget {
  const InventoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final inventoryState = ref.watch(inventoryProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? Colors.white : const Color(0xFF00332C);
    final subTextColor =
        isDark ? Colors.white70 : const Color(0xFF00332C).withOpacity(0.7);
    final iconColor = isDark ? Colors.white : const Color(0xFF006C5B);

    return inventoryState.when(
      data: (items) {
        if (items.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.inventory_2_outlined,
                    size: 64, color: subTextColor.withOpacity(0.5)),
                const SizedBox(height: 16),
                Text(
                  'Add your inventory',
                  style: TextStyle(
                    color: subTextColor,
                    fontSize: 18,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          );
        }
        final grouped = <String, List<Item>>{};
        for (var item in items) {
          if (item.status == ItemStatus.todo) continue;
          grouped.putIfAbsent(item.category, () => []).add(item);
        }

        return Stack(
          children: [
            ListView(
              padding: const EdgeInsets.only(
                  top: 100, bottom: 80), // Padding for AppBar
              children: grouped.entries.map((entry) {
                return Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: GlassContainer(
                    opacity: isDark ? 0.1 : 0.5,
                    blur: 10,
                    child: Theme(
                      data: Theme.of(context).copyWith(
                        dividerColor: Colors.transparent,
                        expansionTileTheme: ExpansionTileThemeData(
                          backgroundColor: Colors.transparent,
                          collapsedBackgroundColor: Colors.transparent,
                          textColor: textColor,
                          collapsedTextColor: textColor,
                          iconColor: textColor,
                          collapsedIconColor: textColor,
                        ),
                      ),
                      child: ExpansionTile(
                        title: Text(
                          entry.key,
                          style: const TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 18),
                        ),
                        initiallyExpanded: true,
                        children: entry.value.map((item) {
                          return Dismissible(
                            key: Key(item.id),
                            background: Container(
                              margin: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.red.withOpacity(0.8),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              alignment: Alignment.centerRight,
                              padding: const EdgeInsets.only(right: 20),
                              child:
                                  const Icon(Icons.delete, color: Colors.white),
                            ),
                            direction: DismissDirection.endToStart,
                            onDismissed: (direction) {
                              ref
                                  .read(inventoryProvider.notifier)
                                  .deleteItem(item.id);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('${item.name} deleted')),
                              );
                            },
                            child: ListTile(
                              leading: CircleAvatar(
                                backgroundColor: isDark
                                    ? Colors.white24
                                    : const Color(0xFF006C5B).withOpacity(0.1),
                                child: Text(
                                  item.name[0].toUpperCase(),
                                  style: TextStyle(color: iconColor),
                                ),
                              ),
                              title: Text(item.name,
                                  style: TextStyle(color: textColor)),
                              subtitle: Row(
                                children: [
                                  Container(
                                    decoration: BoxDecoration(
                                      color: isDark
                                          ? Colors.white12
                                          : Colors.black12,
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        IconButton(
                                          icon: Icon(Icons.remove,
                                              size: 16, color: iconColor),
                                          onPressed: () {
                                            ref
                                                .read(
                                                    inventoryProvider.notifier)
                                                .decrementQuantity(item);
                                          },
                                          constraints: const BoxConstraints(
                                              minWidth: 32, minHeight: 32),
                                          padding: EdgeInsets.zero,
                                        ),
                                        Text(
                                          '${item.quantity.toInt()} ${item.unit}',
                                          style: TextStyle(
                                              color: subTextColor,
                                              fontSize: 13),
                                        ),
                                        IconButton(
                                          icon: Icon(Icons.add,
                                              size: 16, color: iconColor),
                                          onPressed: () {
                                            ref
                                                .read(
                                                    inventoryProvider.notifier)
                                                .incrementQuantity(item);
                                          },
                                          constraints: const BoxConstraints(
                                              minWidth: 32, minHeight: 32),
                                          padding: EdgeInsets.zero,
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              trailing: _buildStatusChip(item),
                              onLongPress: () {
                                showModalBottomSheet(
                                  context: context,
                                  isScrollControlled: true,
                                  builder: (_) => AddItemSheet(
                                    itemToEdit: item,
                                    onSave: (updatedItem) {
                                      ref
                                          .read(inventoryProvider.notifier)
                                          .updateItem(updatedItem);
                                    },
                                  ),
                                );
                              },
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            Positioned(
              bottom: 20,
              right: 20,
              child: FloatingActionButton(
                onPressed: () {
                  showModalBottomSheet(
                    context: context,
                    isScrollControlled: true,
                    builder: (_) => AddItemSheet(
                      onSave: (newItem) {
                        ref.read(inventoryProvider.notifier).addItem(newItem);
                      },
                    ),
                  );
                },
                backgroundColor: const Color(0xFF006C5B),
                child: const Icon(Icons.add, color: Colors.white),
              ),
            ),
          ],
        );
      },
      loading: () => Center(child: CircularProgressIndicator(color: iconColor)),
      error: (e, st) => Center(
          child: Text('Error: $e',
              style: const TextStyle(color: Colors.redAccent))),
    );
  }

  Widget _buildStatusChip(Item item) {
    Color color;
    switch (item.status) {
      case ItemStatus.available:
        color = Colors.greenAccent.shade700;
        break;
      case ItemStatus.low:
        color = Colors.orangeAccent;
        break;
      case ItemStatus.needToBuy:
        color = Colors.redAccent;
        break;
      case ItemStatus.todo:
        color = Colors.blueGrey;
        break;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.2),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.5)),
      ),
      child: Text(
        item.status.toString().split('.').last,
        style:
            TextStyle(fontSize: 10, color: color, fontWeight: FontWeight.bold),
      ),
    );
  }
}
