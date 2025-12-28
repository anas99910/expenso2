import 'package:inventory_app/features/inventory/domain/entities/item.dart';

abstract class InventoryRepository {
  Future<List<Item>> getItems();
  Future<void> addItem(Item item);
  Future<void> updateItem(Item item);
  Future<void> deleteItem(String id);
  Future<List<Item>> getShoppingList(); // Items with status needToBuy or low
}
