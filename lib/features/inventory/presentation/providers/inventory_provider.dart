import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:inventory_app/features/inventory/domain/entities/item.dart';
import 'package:inventory_app/features/inventory/domain/repositories/inventory_repository.dart';

// Provider for the Repository (Needs to be overridden in main.dart)
final inventoryRepositoryProvider = Provider<InventoryRepository>((ref) {
  throw UnimplementedError('inventoryRepositoryProvider requires override');
});

// StateNotifier to manage Item List
class InventoryNotifier extends StateNotifier<AsyncValue<List<Item>>> {
  final InventoryRepository _repository;

  InventoryNotifier(this._repository) : super(const AsyncValue.loading()) {
    loadItems();
  }

  Future<void> loadItems() async {
    try {
      final items = await _repository.getItems();
      if (items.isEmpty) {
        await _seedDefaultItems();
      } else {
        state = AsyncValue.data(items);
      }
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> _seedDefaultItems() async {
    final defaultItems = [
      const Item(
          id: '1',
          name: 'Potatoes (Batata)',
          category: 'Kitchen',
          quantity: 5.0,
          unit: 'kg',
          status: ItemStatus.available),
      const Item(
          id: '2',
          name: 'Eggs (Bid)',
          category: 'Kitchen',
          quantity: 30.0,
          unit: 'piece',
          status: ItemStatus.available),
      const Item(
          id: '3',
          name: 'Milk (Hlib)',
          category: 'Kitchen',
          quantity: 2.0,
          unit: 'liter',
          status: ItemStatus.low),
      const Item(
          id: '4',
          name: 'Butane Gas',
          category: 'Gas & Utilities',
          quantity: 1.0,
          unit: 'bottle',
          status: ItemStatus.available),
    ];

    for (var item in defaultItems) {
      await _repository.addItem(item);
    }
    // Reload to update state
    final items = await _repository.getItems();
    state = AsyncValue.data(items);
  }

  Future<void> addItem(Item item) async {
    try {
      await _repository.addItem(item);
      await loadItems();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> updateItem(Item item) async {
    try {
      await _repository.updateItem(item);
      await loadItems();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> incrementQuantity(Item item) async {
    // Logic: +1 to quantity. If Low, maybe check if it becomes Available?
    // For now, simple increment.
    final updated = item.copyWith(
      quantity: item.quantity + 1,
      status: (item.status == ItemStatus.needToBuy ||
                  item.status == ItemStatus.low) &&
              (item.quantity + 1 > 1)
          ? ItemStatus.available // Auto update status logic (simplified)
          : item.status,
    );
    await updateItem(updated);
  }

  Future<void> decrementQuantity(Item item) async {
    if (item.quantity <= 0) return;

    final newQuantity = item.quantity - 1;
    final updated = item.copyWith(
      quantity: newQuantity,
      status: newQuantity == 0
          ? ItemStatus.needToBuy
          : (newQuantity < 2 ? ItemStatus.low : item.status),
    );
    await updateItem(updated);
  }

  Future<void> deleteItem(String id) async {
    try {
      await _repository.deleteItem(id);
      await loadItems();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> resetData() async {
    try {
      state = const AsyncValue.loading();
      await _repository.clearAllData();
      await loadItems();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final inventoryProvider =
    StateNotifierProvider<InventoryNotifier, AsyncValue<List<Item>>>((ref) {
  final repository = ref.watch(inventoryRepositoryProvider);
  return InventoryNotifier(repository);
});

// Shopping List Provider (Derived)
final shoppingListProvider = Provider<AsyncValue<List<Item>>>((ref) {
  final inventoryState = ref.watch(inventoryProvider);

  return inventoryState.whenData((items) {
    return items
        .where((item) =>
                item.status == ItemStatus.needToBuy ||
                item.status == ItemStatus.low ||
                (item.isBought == true &&
                    item.status ==
                        ItemStatus
                            .needToBuy) // Keep bought items in list until cleared? Or simple logic.
            // Logic: Shopping list shows NeedToBuy or Low.
            )
        .toList();
  });
});
