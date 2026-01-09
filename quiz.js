function checkAnswers() {
    // Answer Key
    const answers = {
        q1: 'c', // Alan Turing
        q2: 'a', // Dartmouth
        q3: 'b', // ELIZA
        q4: 'c', // Deep Blue
        q5: 'b', // Winter
        q6: 'b', // Create new content
        q7: 'b', // Go
        q8: 'c', // Calculator
        q9: 'a', // Deep Learning
        q10: 'c', // Turing Test meaning

        q11: 'b', // Personalized
        q12: 'b', // Admin
        q13: 'a', // 24/7
        q14: 'b', // Predictive
        q15: 'b', // Adaptive
        q16: 'b', // Facilitator
        q17: 'a', // Access
        q18: 'a', // Smart Content
        q19: 'a', // Privacy
        q20: 'b', // Goal

        q21: 'b', // Kahoot
        q22: 'b', // Lesson plan
        q23: 'a', // Magic Studio
        q24: 'b', // Summary
        q25: 'a', // Behavior
        q26: 'b', // Translation
        q27: 'b', // Auto Gen
        q28: 'a', // Integrity
        q29: 'a', // Brainstorm
        q30: 'b', // Engagement

        q31: 'b', // Prompt
        q32: 'a', // Midjourney
        q33: 'b', // Infographic
        q34: 'b', // Context
        q35: 'a', // Slides
        q36: 'b', // Ethics
        q37: 'a', // Coding help
        q38: 'a', // Visual
        q39: 'b', // Hallucination
        q40: 'a'  // Collaboration
    };

    let score = 0;
    let total = 40;
    let feedbackHTML = '';

    const form = document.getElementById('quizForm');
    const resultDiv = document.getElementById('result');

    for (let i = 1; i <= total; i++) {
        const qName = 'q' + i;
        const selected = form.querySelector(`input[name="${qName}"]:checked`);
        const questionItem = form.querySelector(`input[name="${qName}"]`).closest('.question-item');
        const questionText = questionItem.querySelector('.question-text');

        // Reset previous color
        questionText.style.color = 'inherit';

        if (selected) {
            if (selected.value === answers[qName]) {
                score++;
                questionText.style.color = '#4ade80'; // Green for correct
                questionText.innerHTML += ' <span style="font-size: 0.8em">✓</span>';
            } else {
                questionText.style.color = '#f87171'; // Red for incorrect
                questionText.innerHTML += ` <span style="font-size: 0.8em">✗ (ตอบ: ${answers[qName].toUpperCase()})</span>`;
            }
        } else {
            questionText.style.color = '#f87171'; // Red for incorrect
            questionText.innerHTML += ` <span style="font-size: 0.8em">✗ (ตอบ: ${answers[qName].toUpperCase()})</span>`;
        }
    }

    resultDiv.style.display = 'block';

    let message = '';
    if (score >= 32) {
        message = 'ยอดเยี่ยม! คุณมีความรู้เรื่อง AI ในระดับสูงมาก';
    } else if (score >= 20) {
        message = 'ดีมาก! คุณมีความรู้พื้นฐานที่ดี';
    } else {
        message = 'พยายามอีกนิด! ลองศึกษาเพิ่มเติมดูนะ';
    }

    resultDiv.innerHTML = `
        <p>คะแนนของคุณ: <span style="color: var(--secondary-color); font-size: 2em;">${score}</span> / ${total}</p>
        <p>${message}</p>
        <button onclick="window.location.reload()" class="submit-btn" style="width: auto; padding: 10px 30px; margin-top: 20px;">ทำแบบทดสอบอีกครั้ง</button>
    `;

    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}
