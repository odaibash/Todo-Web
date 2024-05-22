document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            sessionStorage.setItem('user', JSON.stringify(data));
            window.location.href = '/todos';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});






// document.addEventListener('DOMContentLoaded', () => {
//     const loginForm = document.getElementById('loginForm');
//     loginForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;

//         try {
//             const response = await fetch('/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ email, password })
//             });
//             const data = await response.json();
//             if (response.ok) {
//                 sessionStorage.setItem('user', JSON.stringify(data.user));
//                 window.location.href = '/todos';
//             } else {
//                 alert(data.message);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     });
// });