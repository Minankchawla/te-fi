document.addEventListener('DOMContentLoaded', async() => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login tefi.html';
        return;
    }

    const response = await fetch('http://localhost:5000/api/user', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    if (!response.ok) {
        alert(data.message);
        window.location.href = 'login tefi.html';
        return;
    }

    document.getElementById('username').textContent = data.name;
    document.getElementById('data-balance').textContent = data.dataBalance;
});

document.getElementById('deposit-form').addEventListener('submit', async(event) => {
    event.preventDefault();
    const depositAmount = event.target['deposit-amount'].value;
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:5000/api/deposit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ depositAmount })
    });

    const data = await response.json();
    alert(data.message);
    if (response.ok) {
        document.getElementById('data-balance').textContent = data.dataBalance;
    }
});

document.getElementById('withdraw-form').addEventListener('submit', async(event) => {
    event.preventDefault();
    const withdrawAmount = event.target['withdraw-amount'].value;
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:5000/api/withdraw', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ withdrawAmount })
    });

    const data = await response.json();
    alert(data.message);
    if (response.ok) {
        document.getElementById('data-balance').textContent = data.dataBalance;
    }
});