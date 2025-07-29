 // Quiz questions
        const questions = [
            {
                type: 'single',
                question: 'What is the capital of France?',
                options: ['London', 'Paris', 'Berlin', 'Madrid'],
                answer: 'Paris'
            },
            {
                type: 'multi',
                question: 'Which of these are programming languages? (Select all that apply)',
                options: ['JavaScript', 'HTML', 'CSS', 'Python'],
                answer: ['JavaScript', 'Python']
            },
            {
                type: 'fill',
                question: 'The process by which plants make their own food is called __________.',
                answer: 'photosynthesis'
            },
            {
                type: 'single',
                question: 'Which planet is known as the Red Planet?',
                options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
                answer: 'Mars'
            },
            {
                type: 'multi',
                question: 'Which of these are primary colors? (Select all that apply)',
                options: ['Red', 'Green', 'Blue', 'Yellow'],
                answer: ['Red', 'Blue', 'Yellow']
            }
        ];

        // DOM elements
        const questionContainer = document.getElementById('question-container');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const progressBar = document.getElementById('progress');
        const resultContainer = document.getElementById('result-container');
        const scoreElement = document.getElementById('score');
        const restartBtn = document.getElementById('restart-btn');

        // Quiz state
        let currentQuestion = 0;
        let userAnswers = Array(questions.length).fill(null);
        let score = 0;

        // Initialize the quiz
        function initQuiz() {
            showQuestion();
            updateNavigation();
        }

        // Display the current question
        function showQuestion() {
            const question = questions[currentQuestion];
            let questionHTML = '';

            if (question.type === 'single') {
                questionHTML = `
                    <div class="question-container single-select active">
                        <div class="question">${currentQuestion + 1}. ${question.question}</div>
                        <div class="options">
                            ${question.options.map((option, index) => `
                                <div class="option ${userAnswers[currentQuestion] === option ? 'selected' : ''}" 
                                     onclick="selectOption(${index})">
                                    ${option}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            } else if (question.type === 'multi') {
                const selectedOptions = userAnswers[currentQuestion] || [];
                questionHTML = `
                    <div class="question-container multi-select active">
                        <div class="question">${currentQuestion + 1}. ${question.question}</div>
                        <div class="options">
                            ${question.options.map((option, index) => `
                                <div class="option ${selectedOptions.includes(option) ? 'selected' : ''}">
                                    <input type="checkbox" id="option-${index}" 
                                           ${selectedOptions.includes(option) ? 'checked' : ''}
                                           onchange="toggleMultiOption(${index})">
                                    <label for="option-${index}">${option}</label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            } else if (question.type === 'fill') {
                questionHTML = `
                    <div class="question-container fill-blank active">
                        <div class="question">${currentQuestion + 1}. ${question.question}</div>
                        <input type="text" placeholder="Type your answer here..." 
                               value="${userAnswers[currentQuestion] || ''}"
                               oninput="updateFillAnswer(this.value)">
                    </div>
                `;
            }

            questionContainer.innerHTML = questionHTML;
            updateProgress();
        }

        // Select an option for single-select questions
        function selectOption(index) {
            const question = questions[currentQuestion];
            userAnswers[currentQuestion] = question.options[index];
            
            // Update UI
            const options = document.querySelectorAll('.option');
            options.forEach(opt => opt.classList.remove('selected'));
            options[index].classList.add('selected');
            
            updateNavigation();
        }

        // Toggle an option for multi-select questions
        function toggleMultiOption(index) {
            const question = questions[currentQuestion];
            const selectedOptions = userAnswers[currentQuestion] || [];
            const option = question.options[index];
            
            if (selectedOptions.includes(option)) {
                userAnswers[currentQuestion] = selectedOptions.filter(item => item !== option);
            } else {
                userAnswers[currentQuestion] = [...selectedOptions, option];
            }
            
            // Update UI
            const optionElement = document.querySelector(`#option-${index}`).parentElement;
            optionElement.classList.toggle('selected');
            
            updateNavigation();
        }

        // Update answer for fill-in-the-blank questions
        function updateFillAnswer(value) {
            userAnswers[currentQuestion] = value.trim();
            updateNavigation();
        }

        // Update navigation buttons
        function updateNavigation() {
            prevBtn.disabled = currentQuestion === 0;
            
            const isAnswered = userAnswers[currentQuestion] !== null && 
                             (questions[currentQuestion].type !== 'multi' || 
                              userAnswers[currentQuestion].length > 0);
            
            if (currentQuestion === questions.length - 1) {
                nextBtn.textContent = isAnswered ? 'Submit' : 'Skip to Submit';
            } else {
                nextBtn.textContent = isAnswered ? 'Next' : 'Skip';
            }
        }

        // Update progress bar
        function updateProgress() {
            const progress = ((currentQuestion + 1) / questions.length) * 100;
            progressBar.style.width = `${progress}%`;
        }

        // Go to the next question
        function nextQuestion() {
            if (currentQuestion < questions.length - 1) {
                document.querySelector('.question-container.active').classList.remove('active');
                currentQuestion++;
                showQuestion();
            } else {
                showResults();
            }
        }

        // Go to the previous question
        function prevQuestion() {
            document.querySelector('.question-container.active').classList.remove('active');
            currentQuestion--;
            showQuestion();
        }

        // Show quiz results
        function showResults() {
            score = 0;
            
            questions.forEach((question, index) => {
                const userAnswer = userAnswers[index];
                
                if (question.type === 'single' && userAnswer === question.answer) {
                    score++;
                } else if (question.type === 'multi' && 
                          Array.isArray(userAnswer) && 
                          userAnswer.length === question.answer.length &&
                          userAnswer.every(val => question.answer.includes(val))) {
                    score++;
                } else if (question.type === 'fill' && 
                          typeof userAnswer === 'string' && 
                          userAnswer.toLowerCase() === question.answer.toLowerCase()) {
                    score++;
                }
            });
            
            const percentage = Math.round((score / questions.length) * 100);
            scoreElement.textContent = `${percentage}%`;
            
            document.querySelector('.quiz-container').style.display = 'none';
            resultContainer.style.display = 'block';
        }

        // Restart the quiz
        function restartQuiz() {
            currentQuestion = 0;
            userAnswers = Array(questions.length).fill(null);
            score = 0;
            
            document.querySelector('.quiz-container').style.display = 'block';
            resultContainer.style.display = 'none';
            
            showQuestion();
            updateNavigation();
        }

        // Set theme
        function setTheme(theme) {
            document.body.className = theme === 'dark' ? 'dark-theme' : 
                                   theme === 'nature' ? 'nature-theme' : '';
        }

        // Event listeners
        nextBtn.addEventListener('click', nextQuestion);
        prevBtn.addEventListener('click', prevQuestion);
        restartBtn.addEventListener('click', restartQuiz);

        // Initialize the quiz
        initQuiz();