import 'package:flutter/material.dart';
import 'package:inventory_app/core/constants/app_constants.dart';
import 'package:inventory_app/features/inventory/domain/entities/item.dart';
import 'package:uuid/uuid.dart';

class AddItemSheet extends StatefulWidget {
  final Item? itemToEdit;
  final Function(Item) onSave;

  const AddItemSheet({super.key, this.itemToEdit, required this.onSave});

  @override
  State<AddItemSheet> createState() => _AddItemSheetState();
}

class _AddItemSheetState extends State<AddItemSheet> {
  late TextEditingController _nameController;
  late TextEditingController _quantityController;
  late String _category;
  late String _unit;
  late ItemStatus _status;

  @override
  void initState() {
    super.initState();
    final item = widget.itemToEdit;
    _nameController = TextEditingController(text: item?.name ?? '');
    _quantityController = TextEditingController(text: item?.quantity.toString() ?? '1.0');
    _category = item?.category ?? AppConstants.categories.first;
    _unit = item?.unit ?? AppConstants.units.first;
    _status = item?.status ?? ItemStatus.available;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
        left: 16,
        right: 16,
        top: 16,
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              widget.itemToEdit == null ? 'Add New Item' : 'Edit Item',
              style: Theme.of(context).textTheme.headlineSmall,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Item Name',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _quantityController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Quantity',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _unit,
                    decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Unit'),
                    items: AppConstants.units.map((u) => DropdownMenuItem(value: u, child: Text(u))).toList(),
                    onChanged: (val) => setState(() => _unit = val!),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              value: _category,
              decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Category'),
              items: AppConstants.categories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
              onChanged: (val) => setState(() => _category = val!),
            ),
            const SizedBox(height: 12),
             DropdownButtonFormField<ItemStatus>(
              value: _status,
              decoration: const InputDecoration(border: OutlineInputBorder(), labelText: 'Status'),
              items: ItemStatus.values.map((s) => DropdownMenuItem(value: s, child: Text(s.toString().split('.').last))).toList(),
              onChanged: (val) => setState(() => _status = val!),
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: () {
                if (_nameController.text.isEmpty) return;
                
                final newItem = Item(
                  id: widget.itemToEdit?.id ?? const Uuid().v4(),
                  name: _nameController.text,
                  category: _category,
                  quantity: double.tryParse(_quantityController.text) ?? 1.0,
                  unit: _unit,
                  status: _status,
                );
                
                widget.onSave(newItem);
                Navigator.pop(context);
              },
              child: const Text('Save Item'),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
