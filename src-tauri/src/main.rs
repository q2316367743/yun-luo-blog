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
    println!("当前目录：{}", current_dir);
    Command::new("D:\\environment\\node-v16.15.1-win-x64\\npm.cmd")
        .current_dir(current_dir)
        .arg("install")
        .output()
        .expect("命令执行异常错误提示");
}

/**
 * 同步之后
 */
#[tauri::command]
fn sync_after(current_dir: &str) {
    println!("当前目录：{}", current_dir);
    Command::new("D:\\Program Files\\nodejs\\node_global\\hexo.cmd")
        .current_dir(current_dir)
        .arg("d")
        .output()
        .expect("命令执行异常错误提示");
}

fn main() {
    println!("程序启动");
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![npm_install, sync_after])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
