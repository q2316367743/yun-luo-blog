#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::process::Command;

/**
 * npm初始化
 */
#[tauri::command]
fn npm_install(current_dir: &str) {
    Command::new("D:\\environment\\node-v16.15.1-win-x64\\npm.cmd")
        .current_dir(current_dir)
        .arg("install")
        .output()
        .expect("命令执行异常错误提示");
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![npm_install])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
