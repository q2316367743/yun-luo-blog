#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use std::process::Command;

/**
 * npm初始化
 */
#[tauri::command]
fn command_run(command: &str, arg: &str, current_dir: &str) {
    println!("在【{}】目录下执行【{}】【{}】", current_dir, command, arg);
    Command::new(command)
        .current_dir(current_dir)
        .arg(arg)
        .output()
        .expect("命令执行异常错误提示");
}

fn main() {
    println!("程序启动");
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![command_run])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
