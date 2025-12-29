import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:inventory_app/features/inventory/presentation/providers/inventory_provider.dart';
import 'package:inventory_app/core/services/update_service.dart';
import 'package:inventory_app/core/widgets/glass_container.dart';
import 'package:inventory_app/core/theme/theme_provider.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  String _version = '1.0.0';
  String _buildNumber = '1';

  @override
  void initState() {
    super.initState();
    _loadPackageInfo();
  }

  Future<void> _loadPackageInfo() async {
    final packageInfo = await PackageInfo.fromPlatform();
    setState(() {
      _version = packageInfo.version;
      _buildNumber = packageInfo.buildNumber;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? Colors.white : const Color(0xFF00332C);
    final subTextColor =
        isDark ? Colors.white70 : const Color(0xFF00332C).withOpacity(0.7);

    return ListView(
      padding: const EdgeInsets.only(top: 100, left: 16, right: 16, bottom: 20),
      children: [
        Text(
          'Settings',
          style: TextStyle(
            color: textColor,
            fontSize: 32,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Manage your app settings and data',
          style: TextStyle(color: subTextColor, fontSize: 14),
        ),
        const SizedBox(height: 30),
        _buildSectionTitle('App Info'),
        _buildSettingsTile(
          icon: Icons.info_outline,
          title: 'Version',
          subtitle: '$_version ($_buildNumber)',
          onTap: null,
          isDark: isDark,
        ),
        _buildSettingsTile(
          icon: Icons.system_update,
          title: 'Check for Updates',
          subtitle: 'Manually check for a new version',
          onTap: () {
            UpdateService().checkForUpdate(context, silent: false);
          },
          isDark: isDark,
        ),
        const SizedBox(height: 20),
        _buildSectionTitle('Appearance'),
        Consumer(
          builder: (context, ref, child) {
            final themeMode = ref.watch(themeProvider);
            return _buildSettingsTile(
              icon: themeMode == ThemeMode.light
                  ? Icons.light_mode
                  : themeMode == ThemeMode.dark
                      ? Icons.dark_mode
                      : Icons.brightness_auto,
              title: 'App Theme',
              subtitle: themeMode == ThemeMode.system
                  ? 'System Default'
                  : themeMode == ThemeMode.light
                      ? 'Light Mode'
                      : 'Dark Mode',
              onTap: () => _showThemeSelectionDialog(context, ref),
              isDark: isDark,
            );
          },
        ),
        const SizedBox(height: 20),
        _buildSectionTitle('Preferences'),
        _buildSettingsTile(
          icon: Icons.language,
          title: 'Language',
          subtitle: 'English / Arabic',
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Multi-language coming soon!')),
            );
          },
          isDark: isDark,
        ),
        const SizedBox(height: 20),
        _buildSectionTitle('Data Management'),
        _buildSettingsTile(
          icon: Icons.delete_forever,
          title: 'Reset All Data',
          subtitle: 'Clear all items and settings',
          isDestructive: true,
          onTap: () => _showResetConfirmation(context),
          isDark: isDark,
        ),
        const SizedBox(height: 50),
        Center(
          child: Text(
            'Version $_version',
            style:
                TextStyle(color: subTextColor.withOpacity(0.3), fontSize: 12),
          ),
        ),
      ],
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
      child: Text(
        title.toUpperCase(),
        style: const TextStyle(
          color: Color(0xFF006C5B),
          fontSize: 12,
          fontWeight: FontWeight.bold,
          letterSpacing: 1.1,
        ),
      ),
    );
  }

  Widget _buildSettingsTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback? onTap,
    bool isDestructive = false,
    required bool isDark,
  }) {
    final textColor = isDark ? Colors.white : const Color(0xFF00332C);
    final subTextColor =
        isDark ? Colors.white70 : const Color(0xFF00332C).withOpacity(0.7);

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: GlassContainer(
        opacity: isDark ? 0.1 : 0.5,
        blur: 10,
        child: ListTile(
          onTap: onTap,
          leading: Icon(icon,
              color: isDestructive ? Colors.redAccent : subTextColor),
          title: Text(
            title,
            style: TextStyle(
              color: isDestructive ? Colors.redAccent : textColor,
              fontWeight: FontWeight.w600,
            ),
          ),
          subtitle: Text(
            subtitle,
            style:
                TextStyle(color: subTextColor.withOpacity(0.5), fontSize: 12),
          ),
          trailing: onTap != null
              ? Icon(Icons.chevron_right, color: subTextColor.withOpacity(0.3))
              : null,
        ),
      ),
    );
  }

  void _showResetConfirmation(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? Colors.white : const Color(0xFF00332C);
    final subTextColor =
        isDark ? Colors.white70 : const Color(0xFF00332C).withOpacity(0.7);

    showDialog(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        child: GlassContainer(
          opacity: 0.2, // Keep low opacity for dialog
          blur: 15,
          borderRadius: BorderRadius.circular(20),
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.warning_amber_rounded,
                  color: Colors.redAccent, size: 50),
              const SizedBox(height: 16),
              Text(
                'Are you sure?',
                style: TextStyle(
                    color: textColor,
                    fontSize: 22,
                    fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              Text(
                'This will permanently delete all your inventory data and reset to defaults.',
                style: TextStyle(color: subTextColor, fontSize: 14),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child:
                        Text('Cancel', style: TextStyle(color: subTextColor)),
                  ),
                  FilledButton(
                    style: FilledButton.styleFrom(
                      backgroundColor: Colors.redAccent,
                      foregroundColor: Colors.white,
                    ),
                    onPressed: () {
                      ref.read(inventoryProvider.notifier).resetData();
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                            content: Text('Data reset successfully')),
                      );
                    },
                    child: const Text('Reset Data'),
                  ),
                ],
              )
            ],
          ),
        ),
      ),
    );
  }

  void _showThemeSelectionDialog(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? Colors.white : const Color(0xFF00332C);

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
                'Choose Theme',
                style: TextStyle(
                    color: textColor,
                    fontSize: 22,
                    fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              _buildThemeOption(context, ref, 'System Default',
                  Icons.brightness_auto, ThemeMode.system, isDark),
              _buildThemeOption(context, ref, 'Light Mode', Icons.light_mode,
                  ThemeMode.light, isDark),
              _buildThemeOption(context, ref, 'Dark Mode', Icons.dark_mode,
                  ThemeMode.dark, isDark),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildThemeOption(BuildContext context, WidgetRef ref, String title,
      IconData icon, ThemeMode mode, bool isDark) {
    final currentMode = ref.watch(themeProvider);
    final isSelected = currentMode == mode;
    final textColor = isDark ? Colors.white : const Color(0xFF00332C);
    final subTextColor =
        isDark ? Colors.white70 : const Color(0xFF00332C).withOpacity(0.7);

    return ListTile(
      leading: Icon(icon,
          color: isSelected ? const Color(0xFF006C5B) : subTextColor),
      title: Text(title,
          style: TextStyle(
              color: isSelected ? const Color(0xFF006C5B) : textColor,
              fontWeight: FontWeight.bold)),
      trailing: isSelected
          ? const Icon(Icons.check_circle, color: Color(0xFF006C5B))
          : null,
      onTap: () {
        ref.read(themeProvider.notifier).setTheme(mode);
        Navigator.pop(context);
      },
    );
  }
}
