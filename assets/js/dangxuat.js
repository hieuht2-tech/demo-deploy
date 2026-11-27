"use strict";
try { DemoStore.logout(); location.href = 'index.html'; } catch (error) { document.getElementById('logout-message').textContent = error.message; }
