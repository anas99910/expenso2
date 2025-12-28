import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:inventory_app/features/inventory/domain/entities/item.dart';
import 'package:inventory_app/features/inventory/presentation/providers/inventory_provider.dart';
import 'package:inventory_app/core/widgets/glass_container.dart';

class ShoppingListScreen extends ConsumerWidget {
  const ShoppingListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final shoppingListAsync = ref.watch(shoppingListProvider);

    return shoppingListAsync.when(
      data: (items) {
        if (items.isEmpty) {
          return const Center(
              child: Text('Nothing to buy right now!',
                  style: TextStyle(color: Colors.white70)));
        }
        return Stack(
          children: [
            ListView.builder(
              padding: const EdgeInsets.only(
                  top: 100,
                  bottom: 80,
                  left: 16,
                  right: 16), // Padding for AppBar
              itemCount: items.length,
              itemBuilder: (context, index) {
                final item = items[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: GlassContainer(
                    opacity: 0.1,
                    blur: 10,
                    borderRadius: BorderRadius.circular(16),
                    child: CheckboxListTile(
                      value: item.isBought,
                      activeColor: const Color(0xFF006C5B),
                      checkColor: Colors.white,
                      side: const BorderSide(color: Colors.white60),
                      title: Text(item.name,
                          style: TextStyle(
                            decoration: item.isBought
                                ? TextDecoration.lineThrough
                                : null,
                            color:
                                item.isBought ? Colors.white38 : Colors.white,
                            fontWeight: FontWeight.w600,
                          )),
                      subtitle: Text('${item.quantity} ${item.unit}',
                          style: const TextStyle(color: Colors.white70)),
                      secondary: Icon(
                        item.status == ItemStatus.needToBuy
                            ? Icons.warning_amber_rounded
                            : Icons.info_outline,
                        color: item.status == ItemStatus.needToBuy
                            ? Colors.redAccent
                            : Colors.orangeAccent,
                      ),
                      onChanged: (val) {
                        final updated = item.copyWith(isBought: val);
                        ref
                            .read(inventoryProvider.notifier)
                            .updateItem(updated);
                      },
                    ),
                  ),
                );
              },
            ),
            if (items.any((i) => i.isBought))
              Positioned(
                bottom: 20,
                left: 16,
                right: 16,
                child: FilledButton(
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xFF006C5B),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16)),
                  ),
                  onPressed: () {
                    for (var item in items) {
                      if (item.isBought) {
                        final updated = item.copyWith(
                          status: ItemStatus.available,
                          isBought: false,
                        );
                        ref
                            .read(inventoryProvider.notifier)
                            .updateItem(updated);
                      }
                    }
                  },
                  child: const Text('Complete Shopping',
                      style:
                          TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ),
              ),
          ],
        );
      },
      loading: () =>
          const Center(child: CircularProgressIndicator(color: Colors.white)),
      error: (e, st) => Center(
          child: Text('Error: $e',
              style: const TextStyle(color: Colors.redAccent))),
    );
  }
}
