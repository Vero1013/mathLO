// Parent View JavaScript - Fixed Version with Better Error Handling

class ParentDashboard {
    constructor() {
        console.log('ParentDashboard constructor called');
        try {
            this.selectedSkill = null;
            this.questionsData = this.generateSampleQuestions();
            this.init();
        } catch (error) {
            console.error('Error in ParentDashboard constructor:', error);
        }
    }

    init() {
        console.log('ParentDashboard init called');
        try {
            this.setupEventListeners();
            this.initializeProgressCircle();
            this.animateOnLoad();
            
            // Add click listeners for skill items as backup to onclick attributes
            this.setupSkillItemListeners();
            console.log('ParentDashboard initialization complete');
        } catch (error) {
            console.error('Error in ParentDashboard init:', error);
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        try {
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
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    setupSkillItemListeners() {
        console.log('Setting up skill item listeners');
        try {
            const skillItems = document.querySelectorAll('.skill-item');
            console.log('Found skill items:', skillItems.length);
            
            skillItems.forEach((item, index) => {
                console.log(`Setting up skill item ${index + 1}:`, item.dataset.skillId);
                
                // Keep existing onclick attributes, just add event listener as backup
                if (item.hasAttribute('onclick')) {
                    console.log('Found existing onclick for', item.dataset.skillId);
                } else {
                    console.log('Adding event listener for', item.dataset.skillId);
                    item.addEventListener('click', (e) => {
                        console.log(`Skill item ${index + 1} clicked:`, item.dataset.skillId);
                        e.preventDefault();
                        e.stopPropagation();
                        this.showQuestions(item);
                    });
                }
            });
        } catch (error) {
            console.error('Error setting up skill item listeners:', error);
        }
    }

    attachChartBarListeners() {
        console.log('Setting up chart bar listeners');
        try {
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
        } catch (error) {
            console.error('Error setting up chart bar listeners:', error);
        }
    }

    toggleSkillsList(card) {
        console.log('toggleSkillsList called');
        try {
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
        } catch (error) {
            console.error('Error in toggleSkillsList:', error);
        }
    }

    handleFilterChange(filterValue) {
        console.log('handleFilterChange called with:', filterValue);
        try {
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
        } catch (error) {
            console.error('Error in handleFilterChange:', error);
        }
    }

    handleChartBarClick(card, bar) {
        console.log('handleChartBarClick called');
        try {
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
        } catch (error) {
            console.error('Error in handleChartBarClick:', error);
        }
    }

    addShowAllButton(card, filteredStatus) {
        console.log('addShowAllButton called');
        try {
            // Remove existing show all button
            const existingBtn = card.querySelector('.show-all-btn');
            if (existingBtn) {
                existingBtn.remove();
            }
            
            // Create new show all button
            const showAllBtn = document.createElement('button');
            showAllBtn.className = 'show-all-btn';
            showAllBtn.innerHTML = `<i class="fas fa-eye"></i> Show All Skills`;
            showAllBtn.onclick = () => {
                const skillItems = card.querySelectorAll('.skill-item');
                skillItems.forEach(item => {
                    item.style.display = 'flex';
                });
                showAllBtn.remove();
            };
            
            // Insert after topic stats
            const topicStats = card.querySelector('.topic-stats');
            if (topicStats) {
                topicStats.insertAdjacentElement('afterend', showAllBtn);
            }
        } catch (error) {
            console.error('Error in addShowAllButton:', error);
        }
    }

    initializeProgressCircle() {
        console.log('initializeProgressCircle called');
        try {
            const progressCircle = document.querySelector('.progress-circle');
            if (!progressCircle) {
                console.warn('Progress circle not found');
                return;
            }
            
            const progress = parseInt(progressCircle.dataset.progress) || 0;
            const circle = progressCircle.querySelector('.progress-fill');
            
            if (circle) {
                const radius = 50;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (progress / 100) * circumference;
                
                circle.style.strokeDasharray = circumference;
                circle.style.strokeDashoffset = offset;
            }
        } catch (error) {
            console.error('Error in initializeProgressCircle:', error);
        }
    }

    animateOnLoad() {
        console.log('animateOnLoad called');
        try {
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
        } catch (error) {
            console.error('Error in animateOnLoad:', error);
        }
    }

    showQuestions(skillElement) {
        console.log('showQuestions called for:', skillElement.dataset.skillId);
        try {
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
                            <div class="correct-answer">
                                <strong>Correct Answer:</strong> ${q.correctAnswer}
                            </div>
                        </div>
                        <div class="question-date">Attempted: ${q.date}</div>
                    </div>
                `).join('');
                
                panelContent.innerHTML = `
                    <div class="skill-header">
                        <h4>${skillCode}</h4>
                        <p>${skillDescription}</p>
                    </div>
                    <div class="questions-list">
                        ${questionsHtml}
                    </div>
                `;
            }
            
            // Show the panel
            panel.classList.add('active');
        } catch (error) {
            console.error('Error in showQuestions:', error);
        }
    }

    closeQuestionsPanel() {
        console.log('closeQuestionsPanel called');
        try {
            const panel = document.getElementById('questionsPanel');
            if (panel) {
                panel.classList.remove('active');
            }
            
            // Remove selection from all skills
            document.querySelectorAll('.skill-item.selected').forEach(item => {
                item.classList.remove('selected');
            });
        } catch (error) {
            console.error('Error in closeQuestionsPanel:', error);
        }
    }

    generateSampleQuestions() {
        console.log('generateSampleQuestions called');
        // Sample questions data - simplified for debugging
        return {
            '7.RP.A.1': [
                {
                    id: 1,
                    question: "A recipe calls for 2 cups of flour for every 3 cups of sugar. How much flour is needed for 9 cups of sugar?",
                    studentAnswer: "6 cups",
                    correctAnswer: "6 cups",
                    isCorrect: true,
                    date: "2024-05-10"
                }
            ],
            '7.RP.A.2a': [
                {
                    id: 1,
                    question: "Which table represents a proportional relationship?",
                    studentAnswer: "Table B",
                    correctAnswer: "Table B",
                    isCorrect: true,
                    date: "2024-05-09"
                }
            ]
        };
    }
}

// Global functions for HTML onclick attributes (as backup)
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
    console.log('DOM loaded, initializing ParentDashboard...');
    try {
        window.parentApp = new ParentDashboard();
        console.log('ParentApp initialized successfully');
    } catch (error) {
        console.error('Failed to initialize ParentApp:', error);
    }
});