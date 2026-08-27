
        const button = document.getElementById('mainActionBtn');
        button.addEventListener('click', function() {
            const heading = document.querySelector('h1');
            heading.style.color = '#e67e22';
            const para = document.querySelector('p');
            para.textContent = ' You just interacted with the page! Now add your own logic here.';
            alert('Thank you for clicking my button I hope you feel a sense of fulfillment');
        });