"use strict";
const account = DemoStore.currentUser();
const accountInfo = document.getElementById('account-info');
if (account) {
  accountInfo.replaceChildren();
  for (const [label, value] of [['Họ tên',account.fullname],['Tên đăng nhập',account.username],['Email',account.email]]) {
    const line = document.createElement('p'); line.textContent = label + ': ' + (value || 'Chưa có thông tin'); accountInfo.append(line);
  }
  document.getElementById('account-login').hidden = true;
  const logout = document.getElementById('account-logout'); logout.hidden = false; logout.style.display = 'inline-block';
  logout.addEventListener('click', () => { try { DemoStore.logout(); location.href = 'index.html'; } catch (error) { showToast(error.message); } });
} else { accountInfo.textContent = 'Bạn chưa đăng nhập.'; document.getElementById('account-logout').hidden = true; }
