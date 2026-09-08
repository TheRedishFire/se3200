        setTimeout(() =>{
            console.log("This will print after 2 sec");
        }, 2000);
        const button = document.getElementById('mainActionBtn');
        button.addEventListener('click', function() {
            const heading = document.querySelector('h1');
            heading.style.color = '#e67e22';
            const para = document.querySelector('p');
            para.textContent = "Hello! My name is Aaron Valentine. In my free time, I love exploring new hobbies, reading, and spending time outdoors. My favorite thing in the entire world is exploring new countries. I am really excited to learn about back-end development, unlike what we did in SE1400.";
            alert('Thank you for clicking my button I hope you feel a sense of fulfillment');
        });

        function changeColors(){
            const elements = document.querySelectorAll('body');

            elements.forEach(element =>{
                element.classList.toggle('blue');
            });
        }
        const practice = document.getElementById('practice');
        practice.addEventListener('click', changeColors);

        const student = { name: "Aaron", age: 24};
        //mutable but scoped in function var is old way that isnt scopped
        let mstudebt = { name: "Aaron", age: 24};
        // remember everything in javascript is an object
        
        // its my bday
        mstudebt.age = 25;