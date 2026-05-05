// Student Learning Outcomes Interactive Dashboard
class LearningOutcomesApp {
    constructor() {
        this.selectedTopics = new Set();
        this.selectedSkills = new Set();
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeProgressCircle();
        this.animateOnLoad();
        this.updateDropdownCounts();
    }

    setupEventListeners() {
        // Filter dropdown
        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.handleFilterChange(e.target.value);
        });

        // Topic card interactions
        document.querySelectorAll('.topic-card').forEach(card => {
            // Checkbox interactions
            const checkbox = card.querySelector('.topic-select-checkbox');
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    e.stopPropagation();
                    this.handleTopicSelection(card, checkbox.checked);
                });
            }

            // Expand button
            const expandBtn = card.querySelector('.expand-btn');
            if (expandBtn) {
                expandBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleSkillsList(card);
                });
            }

            // Chart bar interactions
            const chartBars = card.querySelectorAll('.chart-bar');
            console.log('Found chart bars:', chartBars.length); // Debug log
            chartBars.forEach(bar => {
                bar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log('Chart bar clicked:', bar.dataset.status); // Debug log
                    this.handleChartBarClick(card, bar);
                });
            });

            // Header click to expand (only header area, not entire card)
            const header = card.querySelector('.topic-header h3');
            if (header) {
                header.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleSkillsList(card);
                });
            }

            // Skill checkbox interactions
            const skillCheckboxes = card.querySelectorAll('.skill-select-checkbox');
            skillCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    e.stopPropagation();
                    this.handleSkillSelection(checkbox, checkbox.checked);
                });
            });
        });

        // Selection summary actions (if they exist)
        const confirmPractice = document.getElementById('confirmPractice');
        const confirmHomework = document.getElementById('confirmHomework');
        const clearSelection = document.getElementById('clearSelection');
        
        if (confirmPractice) {
            confirmPractice.addEventListener('click', () => {
                this.confirmPracticeCreation();
            });
        }
        
        if (confirmHomework) {
            confirmHomework.addEventListener('click', () => {
                this.confirmHomeworkCreation();
            });
        }
        
        if (clearSelection) {
            clearSelection.addEventListener('click', () => {
                this.clearAllSelections();
            });
        }

        // Unit action buttons
        document.querySelectorAll('.unit-worksheet-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const unit = btn.dataset.unit;
                this.createUnitWorksheet(unit);
            });
        });


        // Global action bar buttons
        const createSelectedBtn = document.getElementById('createSelectedWorksheet');
        const clearSkillBtn = document.getElementById('clearSkillSelection');
        
        if (createSelectedBtn) {
            createSelectedBtn.addEventListener('click', () => {
                this.createWorksheetForSelectedSkills();
            });
        }
        
        if (clearSkillBtn) {
            clearSkillBtn.addEventListener('click', () => {
                this.clearAllSkillSelections();
            });
        }

        // Global worksheet button
        const globalWorksheetBtn = document.getElementById('globalCreateWorksheet');
        if (globalWorksheetBtn) {
            globalWorksheetBtn.addEventListener('click', () => {
                this.createWorksheetForSelectedSkills();
            });
        }

        // Unit test worksheet button
        const unitTestBtn = document.getElementById('unitTestWorksheet');
        if (unitTestBtn) {
            unitTestBtn.addEventListener('click', () => {
                this.showUnitTestModal();
            });
        }

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportProgress();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    handleFilterChange(filterValue) {
        this.currentFilter = filterValue;
        const cards = document.querySelectorAll('.topic-card');
        
        cards.forEach(card => {
            if (filterValue === 'all') {
                // Show all topics and all skills
                card.style.display = 'block';
                card.classList.add('fade-in');
                this.showAllSkills(card);
                this.hideCreateWorksheetButton(card);
                this.clearChartBarFilters(card);
            } else {
                // Check if this topic has any skills of the selected status
                const skillsOfStatus = card.querySelectorAll(`.skill-item.${filterValue}`);
                
                if (skillsOfStatus.length > 0) {
                    // Show topic and filter to show only skills of selected status
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                    
                    // Expand skills list and filter by status
                    const skillsList = card.querySelector('.skills-list');
                    const expandBtn = card.querySelector('.expand-btn');
                    
                    if (skillsList) {
                        skillsList.classList.remove('collapsed');
                        skillsList.classList.add('expanded');
                        if (expandBtn) expandBtn.classList.add('expanded');
                        this.animateExpansion(skillsList);
                    }
                    
                    // Filter skills by status
                    this.filterSkillsByStatus(card, filterValue);
                    
                    // Show appropriate worksheet button
                    this.showCreateWorksheetButton(card, filterValue);
                    
                    // Highlight the corresponding chart bar
                    this.highlightChartBar(card, filterValue);
                } else {
                    // Hide topic if it has no skills of the selected status
                    card.style.display = 'none';
                    card.classList.remove('fade-in');
                }
            }
        });

        this.updateVisibleCount();
    }

    handleTopicSelection(card, isSelected) {
        const topicId = card.dataset.topic;
        const checkbox = card.querySelector('.topic-select-checkbox');
        
        if (isSelected) {
            this.selectedTopics.add(topicId);
            card.classList.add('selected');
            checkbox.checked = true;
        } else {
            this.selectedTopics.delete(topicId);
            card.classList.remove('selected');
            checkbox.checked = false;
        }

        this.updateSelectionSummary();
        this.animateSelection(card);
    }

    toggleTopicSelection(card) {
        const topicId = card.dataset.topic;
        const checkbox = card.querySelector('.topic-select-checkbox');
        const isCurrentlySelected = this.selectedTopics.has(topicId);
        
        this.handleTopicSelection(card, !isCurrentlySelected);
    }

    handleSkillSelection(checkbox, isSelected) {
        const skillId = checkbox.dataset.skillId;
        const skillItem = checkbox.closest('.skill-item');
        
        if (isSelected) {
            this.selectedSkills.add(skillId);
            skillItem.classList.add('selected');
            checkbox.checked = true;
        } else {
            this.selectedSkills.delete(skillId);
            skillItem.classList.remove('selected');
            checkbox.checked = false;
        }

        this.updateSkillSelectionSummary();
        console.log('Selected skills:', Array.from(this.selectedSkills));
    }

    updateSkillSelectionSummary() {
        const selectedCount = this.selectedSkills.size;
        const actionBar = document.getElementById('skillsActionBar');
        const countElement = document.getElementById('selectedSkillsCount');
        
        if (selectedCount > 0) {
            // Show action bar
            actionBar.style.display = 'block';
            actionBar.classList.add('show');
            
            // Update count text
            const skillText = selectedCount === 1 ? 'skill' : 'skills';
            countElement.textContent = `${selectedCount} ${skillText} selected`;
        } else {
            // Hide action bar
            actionBar.classList.remove('show');
            setTimeout(() => {
                if (this.selectedSkills.size === 0) {
                    actionBar.style.display = 'none';
                }
            }, 300);
        }
        
        console.log(`${selectedCount} skills selected`);
    }

    clearAllSkillSelections() {
        this.selectedSkills.forEach(skillId => {
            const checkbox = document.querySelector(`[data-skill-id="${skillId}"]`);
            if (checkbox) {
                const skillItem = checkbox.closest('.skill-item');
                skillItem.classList.remove('selected');
                checkbox.checked = false;
            }
        });
        
        this.selectedSkills.clear();
        this.updateSkillSelectionSummary();
    }

    createUnitWorksheet(unit) {
        const unitName = this.getUnitName(unit);
        this.showNotification(`Creating worksheet for ${unitName}...`, 'info');
        
        // Simulate worksheet creation
        setTimeout(() => {
            this.showNotification(`Worksheet for "${unitName}" created successfully!`, 'success');
        }, 1500);
        
        console.log('Creating unit worksheet for:', unit);
    }


    createWorksheetForSelectedSkills() {
        const selectedCount = this.selectedSkills.size;
        if (selectedCount === 0) {
            this.showNotification('No skills selected. Please select skills first.', 'warning');
            return;
        }
        
        const skillText = selectedCount === 1 ? 'skill' : 'skills';
        this.showNotification(`Creating worksheet for ${selectedCount} selected ${skillText}...`, 'info');
        
        // Simulate worksheet creation
        setTimeout(() => {
            this.showNotification(`Worksheet with ${selectedCount} ${skillText} created successfully!`, 'success');
            // Optionally clear selection after creation
            // this.clearAllSkillSelections();
        }, 1500);
        
        console.log('Creating worksheet for selected skills:', Array.from(this.selectedSkills));
    }

    getUnitName(unit) {
        const unitNames = {
            'ratios': 'Ratios and Proportional Relationships',
            'numbers': 'The Number System',
            'expressions': 'Expressions and Equations',
            'geometry': 'Geometry',
            'statistics': 'Statistics and Probability'
        };
        return unitNames[unit] || unit;
    }

    showUnitTestModal() {
        // Create unit test modal
        const modal = document.createElement('div');
        modal.className = 'worksheet-modal';
        modal.innerHTML = `
            <div class="worksheet-modal-content">
                <div class="worksheet-header">
                    <h3>Create Unit Test Worksheet</h3>
                    <button class="close-btn" data-action="close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="worksheet-body">
                    <p class="worksheet-instruction">Select a topic to create a comprehensive worksheet for the entire unit:</p>
                    <div class="unit-selector">
                        <div class="unit-option" data-unit="ratios">
                            <input type="radio" id="unit-ratios" name="selectedUnit" value="ratios">
                            <label for="unit-ratios">
                                <span class="unit-title">Ratios and Proportional Relationships</span>
                                <span class="unit-skills">6 skills total</span>
                            </label>
                        </div>
                        <div class="unit-option" data-unit="numbers">
                            <input type="radio" id="unit-numbers" name="selectedUnit" value="numbers">
                            <label for="unit-numbers">
                                <span class="unit-title">The Number System</span>
                                <span class="unit-skills">8 skills total</span>
                            </label>
                        </div>
                        <div class="unit-option" data-unit="expressions">
                            <input type="radio" id="unit-expressions" name="selectedUnit" value="expressions">
                            <label for="unit-expressions">
                                <span class="unit-title">Expressions and Equations</span>
                                <span class="unit-skills">6 skills total</span>
                            </label>
                        </div>
                        <div class="unit-option" data-unit="geometry">
                            <input type="radio" id="unit-geometry" name="selectedUnit" value="geometry">
                            <label for="unit-geometry">
                                <span class="unit-title">Geometry</span>
                                <span class="unit-skills">6 skills total</span>
                            </label>
                        </div>
                        <div class="unit-option" data-unit="statistics">
                            <input type="radio" id="unit-statistics" name="selectedUnit" value="statistics">
                            <label for="unit-statistics">
                                <span class="unit-title">Statistics and Probability</span>
                                <span class="unit-skills">8 skills total</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="worksheet-footer">
                    <button class="action-btn tertiary" data-action="cancel">Cancel</button>
                    <button class="action-btn primary" data-action="create-unit-test">Create Unit Test Worksheet</button>
                </div>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('[data-action="close"]').addEventListener('click', () => {
            this.closeWorksheetModal(modal);
        });
        
        modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
            this.closeWorksheetModal(modal);
        });
        
        modal.querySelector('[data-action="create-unit-test"]').addEventListener('click', () => {
            this.createUnitTestWorksheet(modal);
        });
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeWorksheetModal(modal);
            }
        });
        
        // Animate in
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
    }

    createUnitTestWorksheet(modal) {
        const selectedUnit = modal.querySelector('input[name="selectedUnit"]:checked');
        
        if (!selectedUnit) {
            this.showNotification('Please select a unit to create the worksheet.', 'warning');
            return;
        }
        
        const unitValue = selectedUnit.value;
        const unitName = this.getUnitName(unitValue);
        
        this.showNotification(`Creating unit test worksheet for ${unitName}...`, 'info');
        
        // Simulate worksheet generation
        setTimeout(() => {
            this.showNotification(`Unit test worksheet for "${unitName}" created successfully!`, 'success');
            this.closeWorksheetModal(modal);
            
            console.log('Unit test worksheet created for:', unitValue);
        }, 1500);
    }

    showUnitTestModal() {
        // Create unit test modal
        const modal = document.createElement('div');
        modal.className = 'worksheet-modal';
        modal.innerHTML = `
            <div class="worksheet-modal-content">
                <div class="worksheet-header">
                    <h3>Create Unit Test Worksheet</h3>
                    <button class="close-btn" data-action="close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="worksheet-body">
                    <p class="worksheet-instruction">Select a topic to create a comprehensive worksheet for the entire unit:</p>
                    <div class="unit-selector">
                        <div class="unit-option" data-unit="ratios">
                            <input type="radio" id="unit-ratios" name="selectedUnit" value="ratios">
                            <label for="unit-ratios">
                                <span class="unit-title">Ratios and Proportional Relationships</span>
                                <span class="unit-skills">6 skills total</span>
                            </label>
                        </div>
                        <div class="unit-option" data-unit="numbers">
                            <input type="radio" id="unit-numbers" name="selectedUnit" value="numbers">
                            <label for="unit-numbers">
                                <span class="unit-title">The Number System</span>
                                <span class="unit-skills">8 skills total</span>
                            </label>
                        </div>
                        <div class="unit-option" data-unit="expressions">
                            <input type="radio" id="unit-expressions" name="selectedUnit" value="expressions">
                            <label for="unit-expressions">
                                <span class="unit-title">Expressions and Equations</span>
                                <span class="unit-skills">6 skills total</span>
                            </label>
                        </div>
                        <div class="unit-option" data-unit="geometry">
                            <input type="radio" id="unit-geometry" name="selectedUnit" value="geometry">
                            <label for="unit-geometry">
                                <span class="unit-title">Geometry</span>
                                <span class="unit-skills">6 skills total</span>
                            </label>
                        </div>
                        <div class="unit-option" data-unit="statistics">
                            <input type="radio" id="unit-statistics" name="selectedUnit" value="statistics">
                            <label for="unit-statistics">
                                <span class="unit-title">Statistics and Probability</span>
                                <span class="unit-skills">8 skills total</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="worksheet-footer">
                    <button class="action-btn tertiary" data-action="cancel">Cancel</button>
                    <button class="action-btn primary" data-action="create-unit-test">Create Unit Test Worksheet</button>
                </div>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('[data-action="close"]').addEventListener('click', () => {
            this.closeWorksheetModal(modal);
        });
        
        modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
            this.closeWorksheetModal(modal);
        });
        
        modal.querySelector('[data-action="create-unit-test"]').addEventListener('click', () => {
            this.createUnitTestWorksheet(modal);
        });
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeWorksheetModal(modal);
            }
        });
        
        // Animate in
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
    }

    createUnitTestWorksheet(modal) {
        const selectedUnit = modal.querySelector('input[name="selectedUnit"]:checked');
        
        if (!selectedUnit) {
            this.showNotification('Please select a unit to create the worksheet.', 'warning');
            return;
        }
        
        const unitValue = selectedUnit.value;
        const unitName = this.getUnitName(unitValue);
        
        this.showNotification(`Creating unit test worksheet for ${unitName}...`, 'info');
        
        // Simulate worksheet generation
        setTimeout(() => {
            this.showNotification(`Unit test worksheet for "${unitName}" created successfully!`, 'success');
            this.closeWorksheetModal(modal);
            
            console.log('Unit test worksheet created for:', unitValue);
        }, 1500);
    }

    toggleSkillsList(card) {
        const skillsList = card.querySelector('.skills-list');
        const expandBtn = card.querySelector('.expand-btn');
        
        if (skillsList.classList.contains('expanded')) {
            skillsList.classList.remove('expanded');
            skillsList.classList.add('collapsed');
            expandBtn.classList.remove('expanded');
            // Clear any active chart bar filters
            this.clearChartBarFilters(card);
        } else {
            skillsList.classList.remove('collapsed');
            skillsList.classList.add('expanded');
            expandBtn.classList.add('expanded');
        }

        // Animate the expansion
        this.animateExpansion(skillsList);
    }

    handleChartBarClick(card, bar) {
        console.log('=== Chart Bar Click ==='); // Debug log
        const status = bar.dataset.status;
        const count = parseInt(bar.dataset.count);
        
        console.log('Status:', status, 'Count:', count); // Debug log
        
        if (count === 0) {
            this.showNotification(`No skills in "${this.getStatusLabel(status)}" category`, 'info');
            return;
        }

        // Always clear all active bars first and activate this one
        this.clearChartBarFilters(card);
        
        // Activate this bar and filter skills
        bar.classList.add('active');
        console.log('Bar activated, filtering skills by:', status); // Debug log
        
        // ALWAYS ensure skills list is expanded first
        const skillsList = card.querySelector('.skills-list');
        const expandBtn = card.querySelector('.expand-btn');
        
        console.log('Skills list found:', !!skillsList); // Debug log
        console.log('Skills list classes before:', skillsList ? skillsList.className : 'none'); // Debug log
        
        if (skillsList) {
            skillsList.classList.remove('collapsed');
            skillsList.classList.add('expanded');
            if (expandBtn) {
                expandBtn.classList.add('expanded');
            }
            this.animateExpansion(skillsList);
            console.log('Skills list expanded'); // Debug log
        }
        
        // Then filter the skills
        this.filterSkillsByStatus(card, status);
        
        // Show create worksheet button for ALL skill categories
        console.log(`Showing worksheet button for ${status} skills`); // Debug log
        this.showCreateWorksheetButton(card, status);
        
        this.showNotification(`Showing ${count} ${this.getStatusLabel(status)} skills`, 'info');
    }

    clearChartBarFilters(card) {
        const chartBars = card.querySelectorAll('.chart-bar');
        chartBars.forEach(bar => bar.classList.remove('active'));
        this.showAllSkills(card);
        // Always hide worksheet button when clearing filters
        this.hideCreateWorksheetButton(card);
    }

    filterSkillsByStatus(card, status) {
        const skills = card.querySelectorAll('.skill-item');
        let visibleCount = 0;
        
        console.log(`Total skills found: ${skills.length}`); // Debug log
        console.log(`Filtering for status: ${status}`); // Debug log
        
        skills.forEach((skill, index) => {
            const skillClasses = skill.className;
            const hasStatus = skill.classList.contains(status);
            
            console.log(`Skill ${index}: classes="${skillClasses}", hasStatus=${hasStatus}`); // Debug log
            
            // Only show skills that exactly match the selected status
            if (hasStatus) {
                skill.style.display = 'flex';
                skill.classList.add('fade-in');
                visibleCount++;
                console.log(`Skill ${index} made visible`); // Debug log
            } else {
                skill.style.display = 'none';
                skill.classList.remove('fade-in');
                console.log(`Skill ${index} hidden`); // Debug log
            }
        });
        
        console.log(`Final result: ${visibleCount} ${status} skills visible`); // Debug log
    }

    showAllSkills(card) {
        const skills = card.querySelectorAll('.skill-item');
        skills.forEach(skill => {
            skill.style.display = 'flex';
            skill.classList.add('fade-in');
        });
    }

    getStatusLabel(status) {
        const labels = {
            'mastered': 'Mastered',
            'covered': 'Concept Covered',
            'attention': 'Needs Attention',
            'not-started': 'Not Started'
        };
        return labels[status] || status;
    }

    showCreateWorksheetButton(card, status = 'mastered') {
        // Always remove existing worksheet button first
        this.hideCreateWorksheetButton(card);
        
        console.log(`Creating worksheet button for ${status} skills`); // Debug log
        
        // Get appropriate button text and color based on status
        const buttonConfig = this.getWorksheetButtonConfig(status);
        
        // Create worksheet button
        const worksheetBtn = document.createElement('div');
        worksheetBtn.className = 'worksheet-button-container';
        worksheetBtn.innerHTML = `
            <button class="action-btn ${buttonConfig.class} worksheet-btn" data-action="create-worksheet" data-status="${status}">
                <i class="fas fa-file-alt"></i> ${buttonConfig.text}
            </button>
        `;
        
        // Insert after the chart
        const topicStats = card.querySelector('.topic-stats');
        if (topicStats) {
            topicStats.insertAdjacentElement('afterend', worksheetBtn);
            
            // Add event listener
            const btn = worksheetBtn.querySelector('.worksheet-btn');
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showWorksheetCreator(card, status);
            });
            
            // Animate in
            setTimeout(() => {
                worksheetBtn.classList.add('show');
            }, 100);
        }
    }

    getWorksheetButtonConfig(status) {
        const configs = {
            'mastered': {
                text: 'Create Worksheet',
                class: 'primary'
            },
            'covered': {
                text: 'Create Practice Worksheet',
                class: 'secondary'
            },
            'attention': {
                text: 'Create Review Worksheet',
                class: 'warning'
            },
            'not-started': {
                text: 'Create Introduction Worksheet',
                class: 'tertiary'
            }
        };
        return configs[status] || configs['mastered'];
    }

    highlightChartBar(card, status) {
        // Clear all active chart bars first
        const chartBars = card.querySelectorAll('.chart-bar');
        chartBars.forEach(bar => bar.classList.remove('active'));
        
        // Highlight the chart bar for the selected status
        const targetBar = card.querySelector(`.chart-bar[data-status="${status}"]`);
        if (targetBar) {
            targetBar.classList.add('active');
        }
    }

    hideCreateWorksheetButton(card) {
        const existingBtns = card.querySelectorAll('.worksheet-button-container');
        existingBtns.forEach(btn => {
            console.log('Removing worksheet button'); // Debug log
            btn.remove();
        });
    }

    showWorksheetCreator(card, status = 'mastered') {
        const topicName = card.querySelector('h3').textContent;
        const skillsOfStatus = card.querySelectorAll(`.skill-item.${status}`);
        
        // Get status label for display
        const statusLabel = this.getStatusLabel(status);
        
        // Create worksheet creator modal
        const modal = document.createElement('div');
        modal.className = 'worksheet-modal';
        modal.innerHTML = `
            <div class="worksheet-modal-content">
                <div class="worksheet-header">
                    <h3>Create Worksheet - ${topicName}</h3>
                    <button class="close-btn" data-action="close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="worksheet-body">
                    <p class="worksheet-instruction">Select the ${statusLabel.toLowerCase()} skills to include in the worksheet:</p>
                    <div class="skills-selector">
                        ${Array.from(skillsOfStatus).map(skill => {
                            const code = skill.querySelector('.skill-code').textContent;
                            const description = skill.querySelector('.skill-description').textContent;
                            return `
                                <div class="skill-selector-item">
                                    <input type="checkbox" id="skill-${code}" value="${code}" checked>
                                    <label for="skill-${code}">
                                        <span class="skill-code-selector">${code}</span>
                                        <span class="skill-description-selector">${description}</span>
                                    </label>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                <div class="worksheet-footer">
                    <button class="action-btn tertiary" data-action="cancel">Cancel</button>
                    <button class="action-btn primary" data-action="generate">Generate Worksheet</button>
                </div>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('[data-action="close"]').addEventListener('click', () => {
            this.closeWorksheetModal(modal);
        });
        
        modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
            this.closeWorksheetModal(modal);
        });
        
        modal.querySelector('[data-action="generate"]').addEventListener('click', () => {
            this.generateWorksheet(modal, topicName);
        });
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeWorksheetModal(modal);
            }
        });
        
        // Animate in
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
    }

    closeWorksheetModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }

    generateWorksheet(modal, topicName) {
        const selectedSkills = Array.from(modal.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => ({
                code: checkbox.value,
                description: checkbox.nextElementSibling.querySelector('.skill-description-selector').textContent
            }));
        
        if (selectedSkills.length === 0) {
            this.showNotification('Please select at least one skill for the worksheet.', 'warning');
            return;
        }
        
        this.showNotification(`Generating worksheet with ${selectedSkills.length} skills...`, 'info');
        
        // Simulate worksheet generation
        setTimeout(() => {
            this.showNotification(`Worksheet for "${topicName}" created successfully!`, 'success');
            this.closeWorksheetModal(modal);
            
            // Here you would typically send the data to your backend
            console.log('Worksheet data:', {
                topic: topicName,
                skills: selectedSkills
            });
        }, 1500);
    }

    updateSelectionSummary() {
        const summary = document.getElementById('selectionSummary');
        const selectedItems = document.getElementById('selectedItems');
        
        if (this.selectedTopics.size === 0) {
            summary.style.display = 'none';
            return;
        }

        summary.style.display = 'block';
        summary.classList.add('slide-up');
        
        selectedItems.innerHTML = '';
        this.selectedTopics.forEach(topicId => {
            const card = document.querySelector(`[data-topic="${topicId}"]`);
            const topicName = card.querySelector('h3').textContent;
            
            const item = document.createElement('div');
            item.className = 'selected-item';
            item.innerHTML = `
                <span>${topicName}</span>
                <button class="remove-btn" onclick="app.removeSelection('${topicId}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            selectedItems.appendChild(item);
        });
    }

    removeSelection(topicId) {
        const card = document.querySelector(`[data-topic="${topicId}"]`);
        this.handleTopicSelection(card, false);
    }

    clearAllSelections() {
        this.selectedTopics.forEach(topicId => {
            const card = document.querySelector(`[data-topic="${topicId}"]`);
            const checkbox = card.querySelector('.topic-select-checkbox');
            card.classList.remove('selected');
            if (checkbox) {
                checkbox.checked = false;
            }
        });
        
        this.selectedTopics.clear();
        this.updateSelectionSummary();
    }

    handleCreatePractice() {
        if (this.selectedTopics.size === 0) {
            this.showNotification('Please select at least one topic to create practice exercises.', 'warning');
            return;
        }
        this.updateSelectionSummary();
    }

    handleCreateHomework() {
        if (this.selectedTopics.size === 0) {
            this.showNotification('Please select at least one topic to create homework assignments.', 'warning');
            return;
        }
        this.updateSelectionSummary();
    }

    confirmPracticeCreation() {
        const topics = Array.from(this.selectedTopics);
        this.showNotification(`Creating practice session for ${topics.length} topic(s)...`, 'success');
        
        // Simulate API call
        setTimeout(() => {
            this.showNotification('Practice session created successfully!', 'success');
            this.clearAllSelections();
        }, 2000);
    }

    confirmHomeworkCreation() {
        const topics = Array.from(this.selectedTopics);
        this.showNotification(`Creating homework assignment for ${topics.length} topic(s)...`, 'success');
        
        // Simulate API call
        setTimeout(() => {
            this.showNotification('Homework assignment created successfully!', 'success');
            this.clearAllSelections();
        }, 2000);
    }

    initializeProgressCircle() {
        // Calculate overall progress dynamically
        const overallProgress = this.calculateOverallProgress();
        
        // Update the progress text
        document.querySelector('.percentage').textContent = `${overallProgress}%`;
        
        // Create multi-colored progress circle
        this.createMultiColoredProgressCircle(overallProgress);
    }

    calculateOverallProgress() {
        const allCards = document.querySelectorAll('.topic-card');
        let totalSkills = 0;
        let masteredSkills = 0;
        
        allCards.forEach(card => {
            // Get total skills from the stat display
            const topicTotalSkills = parseInt(card.querySelector('.stat-value').textContent);
            
            // Get mastered skills from the bar chart data
            const masteredBar = card.querySelector('.chart-bar[data-status="mastered"]');
            const topicMasteredSkills = masteredBar ? parseInt(masteredBar.dataset.count) : 0;
            
            console.log(`Topic: ${card.dataset.topic}, Total: ${topicTotalSkills}, Mastered: ${topicMasteredSkills}`);
            
            totalSkills += topicTotalSkills;
            masteredSkills += topicMasteredSkills;
        });
        
        console.log(`Overall - Total Skills: ${totalSkills}, Mastered Skills: ${masteredSkills}`);
        const progress = totalSkills > 0 ? Math.round((masteredSkills / totalSkills) * 100) : 0;
        console.log(`Overall Progress: ${progress}%`);
        
        return progress;
    }

    createMultiColoredProgressCircle(overallProgress) {
        const progressContainer = document.querySelector('.progress-circle');
        
        // Clear existing content
        progressContainer.innerHTML = `
            <div class="progress-text">
                <span class="progress-value">${overallProgress}%</span>
                <span class="progress-label">Overall</span>
            </div>
        `;
        
        // Create new SVG arc
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'progress-ring');
        svg.setAttribute('width', '100');
        svg.setAttribute('height', '100');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        
        // Get topic progress data
        const topicData = this.getTopicProgressData();
        let totalMasteredSkills = topicData.reduce((sum, topic) => sum + topic.masteredSkills, 0);
        
        console.log('Creating multi-colored arc with topics:', topicData);
        console.log('Total mastered skills:', totalMasteredSkills);
        
        const centerX = 50;
        const centerY = 50;
        const radius = 40;
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
        bgCircle.style.transformOrigin = '50px 50px';
        svg.appendChild(bgCircle);
        
        // Create colored arc segments based on mastered skills
        let currentOffset = 0;
        const totalProgressLength = (overallProgress / 100) * circumference;
        
        topicData.forEach((topic, index) => {
            if (topic.masteredSkills > 0) {
                // Calculate this topic's contribution to the overall progress
                const topicContribution = topic.masteredSkills / totalMasteredSkills;
                const segmentLength = totalProgressLength * topicContribution;
                
                console.log(`Topic ${index} (${topic.name}): ${topic.masteredSkills} skills, contribution: ${Math.round(topicContribution * 100)}%`);
                
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', centerX);
                circle.setAttribute('cy', centerY);
                circle.setAttribute('r', radius);
                circle.setAttribute('fill', 'none');
                circle.setAttribute('stroke', this.getTopicColor(index));
                circle.setAttribute('stroke-width', '8');
                circle.setAttribute('stroke-linecap', 'round');
                circle.setAttribute('stroke-dasharray', `${segmentLength} ${circumference}`);
                circle.setAttribute('stroke-dashoffset', circumference - currentOffset - segmentLength);
                circle.style.transform = 'rotate(-90deg)';
                circle.style.transformOrigin = '50px 50px';
                
                svg.appendChild(circle);
                currentOffset += segmentLength;
            }
        });
        
        progressContainer.appendChild(svg);
        
        // Create progress legend
        this.createProgressLegend(topicData);
    }

    getTopicProgressData() {
        const allCards = document.querySelectorAll('.topic-card');
        const topicData = [];
        
        allCards.forEach(card => {
            const topicName = card.querySelector('h3').textContent;
            const totalSkills = parseInt(card.querySelector('.stat-value').textContent);
            
            // Get mastered skills from the bar chart data
            const masteredBar = card.querySelector('.chart-bar[data-status="mastered"]');
            const masteredSkills = masteredBar ? parseInt(masteredBar.dataset.count) : 0;
            
            topicData.push({
                name: topicName,
                totalSkills: totalSkills,
                masteredSkills: masteredSkills,
                percentage: totalSkills > 0 ? Math.round((masteredSkills / totalSkills) * 100) : 0
            });
        });
        
        return topicData;
    }

    createProgressLegend(topicData) {
        const legendContainer = document.querySelector('.progress-legend');
        if (!legendContainer) {
            // Create legend container if it doesn't exist
            const progressContainer = document.querySelector('.overall-progress');
            const legend = document.createElement('div');
            legend.className = 'progress-legend';
            progressContainer.appendChild(legend);
        }

        const legend = document.querySelector('.progress-legend');
        legend.innerHTML = '';

        // Show all topics in the legend without skill counts
        topicData.forEach((topic, index) => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            const fullTopicName = this.getFullTopicName(topic.name);
            legendItem.innerHTML = `
                <div class="legend-color" style="background-color: ${this.getTopicColor(index)}"></div>
                <span class="legend-text">${fullTopicName}</span>
            `;
            legend.appendChild(legendItem);
        });
    }

    getFullTopicName(shortName) {
        const topicNames = {
            'Ratios and Proportional Relationships': 'Ratios and Proportional Relationships',
            'The Number System': 'The Number System',
            'Expressions and Equations': 'Expressions and Equations',
            'Geometry': 'Geometry',
            'Statistics and Probability': 'Statistics and Probability'
        };
        return topicNames[shortName] || this.capitalizeFirst(shortName);
    }

    getTopicColor(index) {
        const colors = [
            '#4CAF50', // Green for first topic
            '#2196F3', // Blue for second topic
            '#FF9800', // Orange for third topic
            '#9C27B0', // Purple for fourth topic
            '#F44336', // Red for fifth topic
            '#00BCD4', // Cyan for additional topics
            '#795548', // Brown
            '#607D8B'  // Blue Grey
        ];
        return colors[index % colors.length];
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getProgressColor(progress) {
        if (progress >= 80) return '#10b981';
        if (progress >= 60) return '#6366f1';
        if (progress >= 40) return '#f59e0b';
        return '#ef4444';
    }

    animateOnLoad() {
        const cards = document.querySelectorAll('.topic-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }

    animateSelection(card) {
        card.style.transform = 'scale(1.02)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 200);
    }

    animateExpansion(skillsList) {
        if (skillsList.classList.contains('expanded')) {
            // Remove max-height temporarily to get actual height
            skillsList.style.maxHeight = 'none';
            const actualHeight = skillsList.scrollHeight;
            skillsList.style.maxHeight = '0px';
            
            // Force reflow
            skillsList.offsetHeight;
            
            // Animate to actual height
            requestAnimationFrame(() => {
                skillsList.style.maxHeight = actualHeight + 'px';
            });
            
            console.log(`Animating expansion to ${actualHeight}px`); // Debug log
        } else {
            skillsList.style.maxHeight = '0px';
            console.log('Animating collapse to 0px'); // Debug log
        }
    }

    updateVisibleCount() {
        // Update dropdown options with counts
        this.updateDropdownCounts();
    }

    updateDropdownCounts() {
        const filterSelect = document.getElementById('statusFilter');
        const allCards = document.querySelectorAll('.topic-card');
        
        // Count topics that have skills in each category
        const counts = {
            'all': allCards.length,
            'mastered': 0,
            'covered': 0,
            'attention': 0,
            'not-started': 0
        };
        
        allCards.forEach(card => {
            if (card.querySelectorAll('.skill-item.mastered').length > 0) counts.mastered++;
            if (card.querySelectorAll('.skill-item.covered').length > 0) counts.covered++;
            if (card.querySelectorAll('.skill-item.attention').length > 0) counts.attention++;
            if (card.querySelectorAll('.skill-item.not-started').length > 0) counts['not-started']++;
        });
        
        // Update option texts
        filterSelect.options[0].text = `All Topics (${counts.all})`;
        filterSelect.options[1].text = `Mastered (${counts.mastered})`;
        filterSelect.options[2].text = `Concept Covered (${counts.covered})`;
        filterSelect.options[3].text = `Needs Attention (${counts.attention})`;
        filterSelect.options[4].text = `Not Started (${counts['not-started']})`;
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + A: Select all visible topics
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            this.selectAllVisible();
        }
        
        // Escape: Clear selections
        if (e.key === 'Escape') {
            this.clearAllSelections();
        }
        
        // Ctrl/Cmd + P: Create practice
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            this.handleCreatePractice();
        }
        
        // Ctrl/Cmd + H: Create homework
        if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
            e.preventDefault();
            this.handleCreateHomework();
        }
    }

    selectAllVisible() {
        const visibleCards = document.querySelectorAll('.topic-card:not([style*="display: none"])');
        visibleCards.forEach(card => {
            const topicId = card.dataset.topic;
            if (!this.selectedTopics.has(topicId)) {
                this.handleTopicSelection(card, true);
            }
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#6366f1'
        };
        return colors[type] || colors.info;
    }

    // Advanced features
    exportProgress() {
        const progressData = {
            student: 'Nia Advani',
            grade: 6,
            overallProgress: 34,
            topics: []
        };

        document.querySelectorAll('.topic-card').forEach(card => {
            const topic = {
                name: card.querySelector('h3').textContent,
                status: card.dataset.status,
                totalSkills: parseInt(card.querySelector('.stat-value').textContent),
                completedSkills: parseInt(card.querySelectorAll('.stat-value')[1].textContent),
                skills: []
            };

            card.querySelectorAll('.skill-item').forEach(skill => {
                topic.skills.push({
                    code: skill.querySelector('.skill-code').textContent,
                    description: skill.querySelector('.skill-description').textContent,
                    status: skill.className.split(' ').find(cls => 
                        ['mastered', 'covered', 'attention', 'not-started'].includes(cls)
                    )
                });
            });

            progressData.topics.push(topic);
        });

        // Download as JSON
        const blob = new Blob([JSON.stringify(progressData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'learning-progress.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    generateReport() {
        const reportWindow = window.open('', '_blank');
        const reportContent = this.buildReportHTML();
        reportWindow.document.write(reportContent);
        reportWindow.document.close();
    }

    buildReportHTML() {
        const topics = Array.from(document.querySelectorAll('.topic-card'));
        const topicsHTML = topics.map(card => {
            const name = card.querySelector('h3').textContent;
            const status = card.dataset.status;
            const progress = card.querySelector('.progress-fill').style.width;
            
            return `
                <div class="report-topic">
                    <h3>${name}</h3>
                    <p>Status: ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
                    <p>Progress: ${progress}</p>
                </div>
            `;
        }).join('');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Learning Progress Report - Nia Advani</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .header { text-align: center; margin-bottom: 40px; }
                    .report-topic { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Learning Progress Report</h1>
                    <h2>Nia Advani - Grade 6</h2>
                    <p>Generated on: ${new Date().toLocaleDateString()}</p>
                </div>
                <div class="topics">
                    ${topicsHTML}
                </div>
            </body>
            </html>
        `;
    }
}

// Initialize the application
const app = new LearningOutcomesApp();

// Add export functionality to buttons (if needed)
document.addEventListener('DOMContentLoaded', () => {
    // Add export button if not exists
    const controls = document.querySelector('.filter-controls');
    if (controls && !document.getElementById('exportBtn')) {
        const exportBtn = document.createElement('button');
        exportBtn.id = 'exportBtn';
        exportBtn.className = 'action-btn tertiary';
        exportBtn.innerHTML = '<i class="fas fa-download"></i> Export';
        exportBtn.addEventListener('click', () => app.exportProgress());
        controls.appendChild(exportBtn);
    }
});

// Performance optimization: Debounce resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Resize handling if needed
    }, 250);
});

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';