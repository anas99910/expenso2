import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';
import 'package:inventory_app/features/inventory/presentation/providers/inventory_provider.dart';

// Provider for Theme State
final themeProvider = StateNotifierProvider<ThemeNotifier, ThemeMode>((ref) {
  final settingsBox = ref.watch(settingsBoxProvider);
  return ThemeNotifier(settingsBox);
});

class ThemeNotifier extends StateNotifier<ThemeMode> {
  final Box _settingsBox;

  ThemeNotifier(this._settingsBox) : super(ThemeMode.system) {
    _loadTheme();
  }

  void _loadTheme() {
    final String? themeString = _settingsBox.get('theme_mode');
    if (themeString == 'light') {
      state = ThemeMode.light;
    } else if (themeString == 'dark') {
      state = ThemeMode.dark;
    } else {
      state = ThemeMode.system;
    }
  }

  Future<void> setTheme(ThemeMode mode) async {
    state = mode;
    String themeString;
    switch (mode) {
      case ThemeMode.light:
        themeString = 'light';
        break;
      case ThemeMode.dark:
        themeString = 'dark';
        break;
      case ThemeMode.system:
        themeString = 'system';
        break;
    }
    await _settingsBox.put('theme_mode', themeString);
  }
}
