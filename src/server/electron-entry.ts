import { app } from 'electron';

// Electron会在初始化完成并且准备好创建浏览器窗口时调用这个方法
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(res => {
  console.log('ready', res);
  import('./index').then(r => {
    console.log('loaded');
  });
});
