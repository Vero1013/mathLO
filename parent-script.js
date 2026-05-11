// Parent View JavaScript - Questions Panel Functionality

class ParentDashboard {
    constructor() {
        this.selectedSkill = null;
        this.questionsData = this.generateSampleQuestions();
        this.init();
    }

    init() {
        console.log('ParentDashboard initialized');
        this.setupEventListeners();
        this.initializeProgressCircle();
        this.animateOnLoad();
        
        // Add click listeners for skill items as backup to onclick attributes
        this.setupSkillItemListeners();
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        // Expand/collapse buttons
        const expandBtns = document.querySelectorAll('.expand-btn');
        console.log('Found expand buttons:', expandBtns.length);
        expandBtns.forEach((btn, index) => {
            console.log(`Setting up expand button ${index + 1}`);
            btn.addEventListener('click', (e) => {
                console.log('Expand button clicked');
                e.preventDefault();
                e.stopPropagation();
                this.toggleSkillsList(btn.closest('.topic-card'));
            });
        });

        // Filter dropdown
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            console.log('Setting up status filter');
            statusFilter.addEventListener('change', (e) => {
                console.log('Filter changed to:', e.target.value);
                this.handleFilterChange(e.target.value);
            });
        } else {
            console.warn('Status filter not found');
        }

        // Chart bar interactions
        this.attachChartBarListeners();
    }

    setupSkillItemListeners() {
        console.log('Setting up skill item listeners');
        const skillItems = document.querySelectorAll('.skill-item');
        console.log('Found skill items:', skillItems.length);
        
        skillItems.forEach((item, index) => {
            // Remove existing onclick to avoid conflicts
            item.removeAttribute('onclick');
            
            item.addEventListener('click', (e) => {
                console.log(`Skill item ${index + 1} clicked:`, item.dataset.skillId);
                e.preventDefault();
                e.stopPropagation();
                this.showQuestions(item);
            });
        });
    }

    attachChartBarListeners() {
        console.log('Setting up chart bar listeners');
        const chartBars = document.querySelectorAll('.chart-bar');
        console.log('Found chart bars:', chartBars.length);
        
        chartBars.forEach((bar, index) => {
            console.log(`Setting up chart bar ${index + 1}`);
            bar.addEventListener('click', (e) => {
                console.log('Chart bar clicked:', bar.dataset.status);
                e.preventDefault();
                e.stopPropagation();
                this.handleChartBarClick(bar.closest('.topic-card'), bar);
            });
        });
    }

    toggleSkillsList(card) {
        console.log('toggleSkillsList called');
        const skillsList = card.querySelector('.skills-list');
        const expandBtn = card.querySelector('.expand-btn');
        
        if (!skillsList || !expandBtn) {
            console.error('Skills list or expand button not found');
            return;
        }
        
        if (skillsList.classList.contains('expanded')) {
            console.log('Collapsing skills list');
            skillsList.classList.remove('expanded');
            skillsList.classList.add('collapsed');
            expandBtn.classList.remove('expanded');
        } else {
            console.log('Expanding skills list');
            skillsList.classList.remove('collapsed');
            skillsList.classList.add('expanded');
            expandBtn.classList.add('expanded');
        }
    }

    handleFilterChange(filterValue) {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            const status = item.classList.contains('mastered') ? 'mastered' :
                          item.classList.contains('covered') ? 'covered' :
                          item.classList.contains('attention') ? 'attention' : 'not-started';
            
            if (filterValue === 'all' || status === filterValue) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    handleChartBarClick(card, bar) {
        const status = bar.dataset.status;
        const skillItems = card.querySelectorAll('.skill-item');
        
        // Expand the skills list if collapsed
        const skillsList = card.querySelector('.skills-list');
        if (!skillsList.classList.contains('expanded')) {
            this.toggleSkillsList(card);
        }
        
        // Filter skills to show only matching status
        skillItems.forEach(item => {
            const itemStatus = item.classList.contains('mastered') ? 'mastered' :
                              item.classList.contains('covered') ? 'covered' :
                              item.classList.contains('attention') ? 'attention' : 'not-started';
            
            if (itemStatus === status) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Add a "Show All" button to reset the filter
        this.addShowAllButton(card, status);
        
        // Mark the chart bar as active
        card.querySelectorAll('.chart-bar').forEach(b => b.classList.remove('active'));
        bar.classList.add('active');
    }
    
    addShowAllButton(card, filteredStatus) {
        // Remove existing show all button if present
        const existingButton = card.querySelector('.show-all-btn');
        if (existingButton) {
            existingButton.remove();
        }
        
        // Create show all button
        const showAllBtn = document.createElement('div');
        showAllBtn.className = 'show-all-btn';
        showAllBtn.innerHTML = `
            <button class="reset-filter-btn">
                <i class="fas fa-eye"></i> Show All Skills
            </button>
            <span class="filter-info">Showing only: ${this.getStatusLabel(filteredStatus)}</span>
        `;
        
        // Insert after topic stats
        const topicStats = card.querySelector('.topic-stats');
        topicStats.insertAdjacentElement('afterend', showAllBtn);
        
        // Add click handler to reset filter
        showAllBtn.querySelector('.reset-filter-btn').addEventListener('click', () => {
            this.resetSkillFilter(card);
        });
    }
    
    resetSkillFilter(card) {
        const skillItems = card.querySelectorAll('.skill-item');
        
        // Show all skills
        skillItems.forEach(item => {
            item.style.display = 'flex';
        });
        
        // Remove show all button
        const showAllBtn = card.querySelector('.show-all-btn');
        if (showAllBtn) {
            showAllBtn.remove();
        }
        
        // Remove active state from chart bars
        card.querySelectorAll('.chart-bar').forEach(bar => bar.classList.remove('active'));
    }
    
    getStatusLabel(status) {
        const labels = {
            'mastered': 'Doing Great ✅',
            'covered': 'Practiced 📖',
            'attention': 'Needs Practice ⚠️',
            'not-started': 'Not Started ⭕'
        };
        return labels[status] || status;
    }

    initializeProgressCircle() {
        const progressContainer = document.querySelector('.progress-circle');
        
        // Topic data with all 5 Grade 7 topics
        const topicData = [
            { name: 'Ratios and Proportional Relationships', masteredSkills: 3, totalSkills: 6, color: '#3b82f6' },
            { name: 'The Number System', masteredSkills: 2, totalSkills: 8, color: '#f59e0b' },
            { name: 'Expressions and Equations', masteredSkills: 2, totalSkills: 6, color: '#8b5cf6' },
            { name: 'Geometry', masteredSkills: 5, totalSkills: 6, color: '#10b981' },
            { name: 'Statistics and Probability', masteredSkills: 0, totalSkills: 8, color: '#ef4444' }
        ];
        
        // Calculate overall progress based on all topics
        const totalMasteredSkills = topicData.reduce((sum, topic) => sum + topic.masteredSkills, 0);
        const totalSkills = topicData.reduce((sum, topic) => sum + topic.totalSkills, 0);
        const overallProgress = Math.round((totalMasteredSkills / totalSkills) * 100);
        
        // Clear existing content and create new structure like teacher dashboard
        progressContainer.innerHTML = `
            <div class="progress-text">
                <span class="percentage">${overallProgress}%</span>
                <span class="label">Overall</span>
            </div>
        `;
        
        // Create new SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'progress-ring');
        svg.setAttribute('width', '120');
        svg.setAttribute('height', '120');
        svg.setAttribute('viewBox', '0 0 120 120');
        svg.style.position = 'absolute';
        svg.style.top = '-5px';
        svg.style.left = '-5px';
        
        const centerX = 60;
        const centerY = 60;
        const radius = 50;
        const circumference = 2 * Math.PI * radius;
        
        // Create background circle
        const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bgCircle.setAttribute('cx', centerX);
        bgCircle.setAttribute('cy', centerY);
        bgCircle.setAttribute('r', radius);
        bgCircle.setAttribute('fill', 'none');
        bgCircle.setAttribute('stroke', '#e2e8f0');
        bgCircle.setAttribute('stroke-width', '8');
        bgCircle.setAttribute('stroke-dasharray', `${circumference} ${circumference}`);
        bgCircle.setAttribute('stroke-dashoffset', '0');
        bgCircle.style.transform = 'rotate(-90deg)';
        bgCircle.style.transformOrigin = '60px 60px';
        svg.appendChild(bgCircle);
        
        // Create colored segments
        let currentOffset = 0;
        const totalProgressLength = (overallProgress / 100) * circumference;
        let totalMasteredSkills = topicData.reduce((sum, topic) => sum + topic.masteredSkills, 0);
        
        topicData.forEach((topic, index) => {
            if (topic.masteredSkills > 0) {
                const segmentLength = (topic.masteredSkills / totalMasteredSkills) * totalProgressLength;
                
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', centerX);
                circle.setAttribute('cy', centerY);
                circle.setAttribute('r', radius);
                circle.setAttribute('fill', 'none');
                circle.setAttribute('stroke', topic.color);
                circle.setAttribute('stroke-width', '8');
                circle.setAttribute('stroke-linecap', 'round');
                circle.setAttribute('stroke-dasharray', `${segmentLength} ${circumference}`);
                circle.setAttribute('stroke-dashoffset', -currentOffset);
                circle.style.transform = 'rotate(-90deg)';
                circle.style.transformOrigin = '60px 60px';
                
                svg.appendChild(circle);
                currentOffset += segmentLength;
            }
        });
        
        progressContainer.appendChild(svg);
    }

    animateOnLoad() {
        const cards = document.querySelectorAll('.topic-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 + (index * 100));
        });
    }

    showQuestions(skillElement) {
        console.log('showQuestions called for:', skillElement.dataset.skillId);
        
        const skillId = skillElement.dataset.skillId;
        const skillCode = skillElement.querySelector('.skill-code').textContent;
        const skillDescription = skillElement.querySelector('.skill-description').textContent;
        
        // Remove previous selection
        document.querySelectorAll('.skill-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Add selection to current skill
        skillElement.classList.add('selected');
        
        // Get questions for this skill
        const questions = this.questionsData[skillId] || [];
        
        // Update questions panel
        const panel = document.getElementById('questionsPanel');
        const panelContent = panel.querySelector('.panel-content');
        
        if (questions.length === 0) {
            panelContent.innerHTML = `
                <div class="skill-header">
                    <h4>${skillCode}</h4>
                    <p>${skillDescription}</p>
                </div>
                <div class="no-selection">
                    <div class="no-selection-icon">📝</div>
                    <p>No questions attempted yet for this skill.</p>
                </div>
            `;
        } else {
            const questionsHtml = questions.map((q, index) => `
                <div class="question-item ${q.isCorrect ? 'correct' : 'incorrect'}">
                    <div class="question-header">
                        <span class="question-number">Question ${index + 1}</span>
                        <span class="question-status">${q.isCorrect ? '✅' : '❌'}</span>
                    </div>
                    <div class="question-text">${q.question}</div>
                    <div class="answer-section">
                        <div class="student-answer">
                            <strong>Nia's Answer:</strong> ${q.studentAnswer}
                        </div>
                        ${!q.isCorrect ? `
                            <div class="correct-answer">
                                <strong>Correct Answer:</strong> ${q.correctAnswer}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('');
            
            const correctCount = questions.filter(q => q.isCorrect).length;
            const totalCount = questions.length;
            
            panelContent.innerHTML = `
                <div class="skill-header">
                    <h4>${skillCode}</h4>
                    <p>${skillDescription}</p>
                </div>
                <div style="text-align: center; margin-bottom: 16px; padding: 12px; background: #f8fafc; border-radius: 8px;">
                    <strong>Progress: ${correctCount}/${totalCount} correct</strong>
                    <div style="margin-top: 4px; font-size: 0.85rem; color: #64748b;">
                        ${Math.round((correctCount/totalCount) * 100)}% accuracy
                    </div>
                </div>
                ${questionsHtml}
            `;
        }
        
        // Scroll to top of panel
        panelContent.scrollTop = 0;
    }

    closeQuestionsPanel() {
        const panelContent = document.querySelector('.panel-content');
        panelContent.innerHTML = `
            <div class="no-selection">
                <div class="no-selection-icon">📝</div>
                <p>Click on any skill to see the questions Nia has worked on</p>
            </div>
        `;
        
        // Remove all selections
        document.querySelectorAll('.skill-item.selected').forEach(item => {
            item.classList.remove('selected');
        });
    }

    generateSampleQuestions() {
        return {
            '7.RP.A.1': [
                {
                    id: 1,
                    question: "A recipe calls for 2/3 cup of flour for every 1/4 cup of sugar. What is the unit rate of flour to sugar?",
                    studentAnswer: "8/3 cups of flour per cup of sugar",
                    correctAnswer: "8/3 cups of flour per cup of sugar",
                    isCorrect: true,
                    date: "2024-05-08"
                },
                {
                    id: 2,
                    question: "If 3/4 pound of apples costs $2.25, what is the cost per pound?",
                    studentAnswer: "$3.00",
                    correctAnswer: "$3.00",
                    isCorrect: true,
                    date: "2024-05-07"
                },
                {
                    id: 3,
                    question: "A car travels 5/6 mile in 2/3 minute. What is the speed in miles per minute?",
                    studentAnswer: "5/4 miles per minute",
                    correctAnswer: "5/4 miles per minute",
                    isCorrect: true,
                    date: "2024-05-06"
                }
            ],
            '7.RP.A.2d': [
                {
                    id: 1,
                    question: "On a graph showing the relationship between hours worked and money earned, what does the point (5, 75) represent?",
                    studentAnswer: "Working 5 hours earns $75",
                    correctAnswer: "Working 5 hours earns $75",
                    isCorrect: true,
                    date: "2024-05-09"
                },
                {
                    id: 2,
                    question: "In a proportional relationship graph, if the point (3, 12) is on the line, what does this tell us about the situation?",
                    studentAnswer: "When x is 3, y is 12",
                    correctAnswer: "When the input is 3, the output is 12, and this maintains the constant ratio",
                    isCorrect: false,
                    date: "2024-05-08"
                }
            ],
            '7.NS.A.1c': [
                {
                    id: 1,
                    question: "Rewrite 7 - (-3) as an addition problem.",
                    studentAnswer: "7 + (-3)",
                    correctAnswer: "7 + 3",
                    isCorrect: false,
                    date: "2024-05-09"
                },
                {
                    id: 2,
                    question: "What is -5 - 8 written as addition?",
                    studentAnswer: "-5 + (-8)",
                    correctAnswer: "-5 + (-8)",
                    isCorrect: true,
                    date: "2024-05-08"
                },
                {
                    id: 3,
                    question: "Solve: 12 - (-7) using addition.",
                    studentAnswer: "12 + 7 = 19",
                    correctAnswer: "12 + 7 = 19",
                    isCorrect: true,
                    date: "2024-05-07"
                }
            ],
            '7.G.B.4': [
                {
                    id: 1,
                    question: "Find the circumference of a circle with radius 5 cm. Use π ≈ 3.14.",
                    studentAnswer: "31.4 cm",
                    correctAnswer: "31.4 cm",
                    isCorrect: true,
                    date: "2024-05-09"
                },
                {
                    id: 2,
                    question: "A circular garden has a diameter of 8 meters. What is its area?",
                    studentAnswer: "50.24 square meters",
                    correctAnswer: "50.24 square meters",
                    isCorrect: true,
                    date: "2024-05-08"
                }
            ],
            // Expressions and Equations
            '7.EE.A.1': [
                {
                    id: 1,
                    question: "Simplify: 3(x + 4) - 2x",
                    studentAnswer: "x + 12",
                    correctAnswer: "x + 12",
                    isCorrect: true,
                    date: "2024-05-09"
                },
                {
                    id: 2,
                    question: "Factor: 6x + 9",
                    studentAnswer: "3(2x + 3)",
                    correctAnswer: "3(2x + 3)",
                    isCorrect: true,
                    date: "2024-05-08"
                }
            ],
            '7.EE.A.2': [
                {
                    id: 1,
                    question: "A rectangle has length (x + 5) and width 3. Write two equivalent expressions for its perimeter.",
                    studentAnswer: "2(x + 5) + 2(3) and 2x + 16",
                    correctAnswer: "2(x + 5) + 2(3) and 2x + 16",
                    isCorrect: true,
                    date: "2024-05-09"
                }
            ],
            '7.EE.B.3': [
                {
                    id: 1,
                    question: "The temperature dropped 3°F each hour for 4 hours, then rose 5°F. If it started at 68°F, what's the final temperature?",
                    studentAnswer: "61°F",
                    correctAnswer: "61°F",
                    isCorrect: true,
                    date: "2024-05-08"
                },
                {
                    id: 2,
                    question: "Maria has $45. She buys 3 books for $8.50 each and 2 pens for $1.25 each. How much money does she have left?",
                    studentAnswer: "$17.00",
                    correctAnswer: "$17.00",
                    isCorrect: true,
                    date: "2024-05-07"
                }
            ],
            '7.EE.B.4a': [
                {
                    id: 1,
                    question: "Solve: 3x + 7 = 22",
                    studentAnswer: "x = 5",
                    correctAnswer: "x = 5",
                    isCorrect: true,
                    date: "2024-05-09"
                },
                {
                    id: 2,
                    question: "A plumber charges $50 plus $25 per hour. If the total bill was $125, how many hours did the plumber work?",
                    studentAnswer: "3 hours",
                    correctAnswer: "3 hours",
                    isCorrect: true,
                    date: "2024-05-08"
                }
            ],
            '7.EE.B.4b': [
                {
                    id: 1,
                    question: "Solve: 2x + 5 > 13",
                    studentAnswer: "x > 4",
                    correctAnswer: "x > 4",
                    isCorrect: true,
                    date: "2024-05-07"
                },
                {
                    id: 2,
                    question: "A taxi charges $3 plus $2 per mile. For what distances will the fare be more than $15?",
                    studentAnswer: "More than 6 miles",
                    correctAnswer: "More than 6 miles",
                    isCorrect: true,
                    date: "2024-05-06"
                }
            ],
            // Statistics and Probability
            '7.SP.A.1': [
                {
                    id: 1,
                    question: "Explain why surveying 50 students from one school might not represent all middle school students in the state.",
                    studentAnswer: "Because it's only from one school and might not represent different areas",
                    correctAnswer: "The sample is not representative because it's from only one school and may not reflect the diversity of all middle school students in the state",
                    isCorrect: true,
                    date: "2024-05-09"
                }
            ],
            '7.SP.A.2': [
                {
                    id: 1,
                    question: "A random sample of 100 students shows 60% prefer pizza over hamburgers. Estimate how many of the 800 students in the school prefer pizza.",
                    studentAnswer: "480 students",
                    correctAnswer: "480 students",
                    isCorrect: true,
                    date: "2024-05-08"
                }
            ],
            '7.SP.B.3': [
                {
                    id: 1,
                    question: "Compare two data sets: Class A test scores (70, 75, 80, 85, 90) and Class B (60, 70, 80, 90, 100). Which class performed more consistently?",
                    studentAnswer: "Class A because the scores are closer together",
                    correctAnswer: "Class A because it has less variability in scores",
                    isCorrect: true,
                    date: "2024-05-07"
                }
            ],
            '7.SP.B.4': [
                {
                    id: 1,
                    question: "Find the mean and median of this data set: 12, 15, 18, 20, 25",
                    studentAnswer: "Mean = 18, Median = 18",
                    correctAnswer: "Mean = 18, Median = 18",
                    isCorrect: true,
                    date: "2024-05-06"
                }
            ]
        };
    }
}

// Global function to show questions (called from HTML onclick as backup)
function showQuestions(skillElement) {
    console.log('Global showQuestions called for:', skillElement.dataset.skillId);
    
    const app = window.parentApp;
    if (!app) {
        console.error('ParentApp not initialized');
        return;
    }
    
    app.showQuestions(skillElement);
}

function closeQuestionsPanel() {
    console.log('Global closeQuestionsPanel called');
    
    const app = window.parentApp;
    if (!app) {
        console.error('ParentApp not initialized');
        return;
    }
    
    app.closeQuestionsPanel();
}

// Initialize the parent dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.parentApp = new ParentDashboard();
});