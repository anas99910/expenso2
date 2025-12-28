import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:inventory_app/core/constants/app_constants.dart';
import 'package:inventory_app/core/theme/app_theme.dart';
import 'package:inventory_app/features/inventory/data/models/item_model.dart';
import 'package:inventory_app/features/inventory/data/repositories/inventory_repository_impl.dart';
import 'package:inventory_app/features/inventory/presentation/providers/inventory_provider.dart';
import 'package:inventory_app/features/inventory/presentation/screens/home_screen.dart';

void main() async {
  // 1. Initialize Flutter Bindings
  WidgetsFlutterBinding.ensureInitialized();

  // 2. Initialize Hive
  await Hive.initFlutter();
  
  // 3. Register Adapters
  // NOTE: You must run `flutter pub run build_runner build` to generate the Adapter
  Hive.registerAdapter(ItemModelAdapter()); 

  // 4. Open Box
  final box = await Hive.openBox<ItemModel>(AppConstants.hiveBoxName);

  // 5. Initialize Repository
  final repository = InventoryRepositoryImpl(box);

  // 6. Run App with ProviderScope override
  runApp(
    ProviderScope(
      overrides: [
        inventoryRepositoryProvider.overrideWithValue(repository),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Moroccan Inventory',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system, // Auto dark mode
      home: const HomeScreen(),
    );
  }
}
