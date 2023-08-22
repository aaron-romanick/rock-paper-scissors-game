/**
 * @file All functionality of the Rock, Scissors, Paper (, Lizard, Spock) game
 * @author Aaron Romanick <idontneednostinkingspamemail@gmail.com>
 */

/**
 * Handles the game rules dialog box display/opening/closing via the "Rules" button
 * @class
 */
class Rules {
     
    /**
    * Class name indicating when rules dialog is active
    * @returns {String}
    */
    get CLASS_ACTIVE() { return 'active' }
    
    /**
    * Class name "dialog-active"
    * @returns {String}
    */
    get CLASS_DIALOG_ACTIVE() { return 'dialog-active' }

    /**
    * @constructor
    */
    constructor() {
        this.initDOMElements()
        this.initEventListeners()
    }

    /**
    * The event handler to close the rules dialog
    * @param {Event} evt - The click event
    */
    closeDialog(evt) {
        if(
            this.rules.classList.contains(this.CLASS_ACTIVE) &&
            (evt.target.closest('.btn-rules-close') ||
            !evt.target.closest('.rules-dialog'))
        ) this.toggleDialog(evt, false)
    }

    /**
    * Initalizes DOM element properties so we can access them later
    */
    initDOMElements() {
        this.body = document.body
        this.btnRulesOpen = document.querySelector('.btn-rules-open')
        this.rules = document.querySelector('.rules')
    }

    /**
    * Adds event listeners to buttons responsible for opening/closing rules dialog
    */
    initEventListeners() {
        this.btnRulesOpen.addEventListener('click',  this.openDialog.bind(this))
        this.rules.addEventListener('click', this.closeDialog.bind(this))
    }

    /**
    * The event handler to open the rules dialog
    * @param {Event} evt - The click event
    */
    openDialog(evt) {
        this.toggleDialog(evt, true)
    }

    /**
    * The event handler to open the rules dialog
    * @param {Event} evt - The click event
    * @param {Boolean} isActive - The new active state for the rules dialog
    */
    toggleDialog(evt, isActive) {
        evt.cancelBubble = true
        if(evt.stopPropogation) evt.stopPropogation()

        if(isActive) {
            this.rules.classList.add(this.CLASS_ACTIVE)
            this.body.classList.add(this.CLASS_DIALOG_ACTIVE)
        } else {
            this.rules.classList.remove(this.CLASS_ACTIVE)
            this.body.classList.remove(this.CLASS_DIALOG_ACTIVE)
        }
    }
}

/**
 * Handles data transfer to and from localStorage
 * @class
 */
class DataStore {

    /**
    * The key name for whether or not bonus mode is active
    * @returns {String}
    */
    get IS_BONUS_MODE_KEY() { return 'isBonusMode' }

    /**
    * The key name for the score in normal mode
    * @returns {String}
    */
    get SCORE_NORMAL_KEY() { return 'normalScore' }

    /**
    * The key name for the score in bonus mode
    * @returns {String}
    */
    get SCORE_BONUS_KEY() { return 'bonusScore' }

    /**
    * The name of key in localStorage under which data is kept
    * @returns {String}
    */
    get STORAGE_KEY() { return 'rockScissorsPaperGame' }

    /**
    * The default data if there is no data in localStorage
    * @returns {Object}
    */
    get DEFAULT_DATA() {
        return {
            [this.IS_BONUS_MODE_KEY]: false,
            [this.SCORE_NORMAL_KEY]: 0,
            [this.SCORE_BONUS_KEY]: 0,
        }
    }

    /**
    * A quick way to get the current mode's score key name
    * @returns {String}
    */
    get currentScoreKey() {
        return this.data.isBonusMode
            ? this.SCORE_BONUS_KEY
            : this.SCORE_NORMAL_KEY
    }

    /**
    * A quick way to get the current mode's score value
    * @returns {Number}
    */
    get currentScore() {
        return this.data[this.currentScoreKey]
    }

    /**
    * @constructor
    */
    constructor() {
        this.data = this.import()
    }

    /**
    * Saves current data values for game in localStorage
    */
    export() {
        const stringifiedData = JSON.stringify(this.data)
        localStorage.setItem(this.STORAGE_KEY, stringifiedData)
    }

    /**
    * Gets data from localStorage and returns it. If none exists, it creates the default data
    * @returns {Object}
    */
    import() {
        const data = localStorage.getItem(this.STORAGE_KEY)
        return data
            ? JSON.parse(data)
            : this.DEFAULT_DATA
    }

    /**
    * Gets one value from data object by key
    * @returns {(Number|Boolean)}
    */
    read(key) {
        return this.data[key]
    }

    /**
    * Saves one value to data object and then saves data object to localStorage
    */
    save(key, value) {
        this.data[key] = value
        this.export()
    }
}

/**
 * Runs the core of the game with all its functionality
 * @class
 */
class Game {

    /**
    * The name referring to the "scissors" token
    * @returns {String}
    */
    get SCISSORS() { return 'scissors' }

    /**
    * The name referring to the "paper" token
    * @returns {String}
    */
    get PAPER() { return 'paper' }

    /**
    * The name referring to the "rock" token
    * @returns {String}
    */
    get ROCK() { return 'rock' }

    /**
    * The name referring to the "lizard" token
    * @returns {String}
    */
    get LIZARD() { return 'lizard' }

    /**
    * The name referring to the "spock" token
    * @returns {String}
    */
    get SPOCK() { return 'spock' }

    /**
    * An array of objects detailing properties of each game token
    * @returns {Array}
    */
    get TOKEN_TYPES() {
        return [
            {
                type: this.LIZARD,
                isBonus: true,
                beats: [
                    this.PAPER,
                    this.SPOCK,
                ],
            },
            {
                type: this.PAPER,
                isBonus: false,
                beats: [
                    this.ROCK,
                    this.SPOCK,
                ],
            },
            {
                type: this.ROCK,
                isBonus: false,
                beats: [
                    this.LIZARD,
                    this.SCISSORS,
                ],
            },
            {
                type: this.SCISSORS,
                isBonus: false,
                beats: [
                    this.LIZARD,
                    this.PAPER,
                ],
            },
            {
                type: this.SPOCK,
                isBonus: true,
                beats: [
                    this.ROCK,
                    this.SCISSORS,
                ],
            },
        ]
    }

    /**
    * Class name "hidden"
    * @returns {String}
    */
    get CLASS_HIDDEN() { return 'hidden' }

    /**
    * Class name "bonus"
    * @returns {String}
    */
    get CLASS_MODE_BONUS() { return 'bonus' }

    /**
    * Class name "player-choice"
    * @returns {String}
    */
    get CLASS_PLAYER_CHOICE() { return 'player-choice' }

    /**
    * Class name "house-choice"
    * @returns {String}
    */
    get CLASS_HOUSE_CHOICE() { return 'house-choice' }

    /**
    * Class name "masked"
    * @returns {String}
    */
    get CLASS_MASKED() { return 'masked' }

    /**
    * Class name "result-visible"
    * @returns {String}
    */
    get CLASS_RESULT_VISIBLE() { return 'result-visible' }

    /**
    * Class name "winner"
    * @returns {String}
    */
    get CLASS_WINNER() { return 'winner' }

    /**
    * The "src" attribute value for the logo image in normal mode
    * @returns {String}
    */
    get LOGO_SRC_NORMAL() { return 'images/logo.svg' }

    /**
    * The "src" attribute value for the logo image in bonus mode
    * @returns {String}
    */
    get LOGO_SRC_BONUS() { return 'images/bonus/logo.svg' }

    /**
    * The "alt" attribute value for the logo image in normal mode
    * @returns {String}
    */
    get LOGO_ALT_TEXT_NORMAL() { return 'Rock, Scissors, Paper Logo' }

    /**
    * The "alt" attribute value for the logo image in bonus mode
    * @returns {String}
    */
    get LOGO_ALT_TEXT_BONUS() { return 'Rock, Scissors, Paper, Lizard, Spock Logo' }

    /**
    * The "src" attribute value for the rules image in normal mode
    * @returns {String}
    */
    get RULES_SRC_NORMAL() { return 'images/rules.svg' }

    /**
    * The "src" attribute value for the rules image in bonus mode
    * @returns {String}
    */
    get RULES_SRC_BONUS() { return 'images/bonus/rules.svg' }

    /**
    * The "alt" attribute value for the rules image in normal mode
    * @returns {String}
    */
    get RULES_ALT_TEXT_NORMAL() { return 'Rules for Playing Rock, Scissors, Paper' }

    /**
    * The "alt" attribute value for the rules image in bonus mode
    * @returns {String}
    */
    get RULES_ALT_TEXT_BONUS() { return 'Rules for Playing Rock, Scissors, Paper, Lizard, Spock' }

    /**
    * Text displayed when player wins
    * @returns {String}
    */
    get WIN_TEXT() { return 'You win' }

    /**
    * Text displayed when player loses
    * @returns {String}
    */
    get LOSE_TEXT() { return 'You lose' }

    /**
    * Value of whether current game is in normal or bonus mode
    * @returns {Boolean}
    */
    get isBonusMode() { return this.html.classList.contains(this.CLASS_MODE_BONUS) }

    /**
    * Gets current available tokens based on teh current mode of the games
    * @returns {Boolean}
    */
    get currentTokenTypes() {
        return this.isBonusMode
            ? this.TOKEN_TYPES
            : this.TOKEN_TYPES.filter(({ isBonus }) => isBonus === false)
    }

    /**
    * @constructor
    */
    constructor() {
        this.initDOMElements()
        this.initGame()
        this.initEventListeners()
    }

    /**
    * A generic delay function to pause code functionality temporarily
    * @param {Number} ms - How long the delay should be in milliseconds
    * @returns {Promise}
    */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
    * Gets the house token that will lose the current round
    * @returns {Element}
    */
    getHouseLossToken() {
        const callback = (token, playerToken) => {
            return playerToken.beats.includes(token.type)
        }
        return this.getHouseToken(callback)
    }

    /**
    * Gets the house token that will win the current round
    * @returns {Element}
    */
    getHouseWinToken() {
        const callback = (token, playerToken) => {
            return token.beats.includes(playerToken.type)
        }
        return this.getHouseToken(callback)
    }

    /**
    * Gets the house token
    * @returns {Element}
    */
    getHouseToken(callback) {
        const playerToken = this.playerToken
        const houseToken = Array.from(this.currentTokenTypes)
            .sort(() => 0.5 - Math.random()) //shuffle
            .find(token => callback(token, playerToken))
        return document.querySelector(`.btn-token.${houseToken.type}`)
    }

    /**
    * Hide all tokens that are not the player's chosen token
    */
    hideOtherTokens() {
        const filteredTokens = Array.from(this.tokens)
            .filter(token => !token.classList.contains(this.playerToken.type))
        filteredTokens.forEach(token => {
            token.classList.add(this.CLASS_HIDDEN)
        })
    }

    /**
    * Initalizes DOM element properties so we can access them later
    */
    initDOMElements() {
        this.html = document.documentElement
        this.stageBackground = document.querySelector('.stage-background')
        this.modeToggle = document.querySelector('.top-heading button')
        this.logo = this.modeToggle.querySelector('img')
        this.tokens = document.querySelectorAll('.btn-token')
        this.score = document.querySelector('.score-points')
        this.result = document.querySelector('.result')
        this.resultHeading = this.result.querySelector('.result-heading')
        this.playerChoiceLabel = document.querySelector('.choice-label:first-of-type')
        this.houseChoiceLabel = document.querySelector('.choice-label:last-of-type')
        this.rulesContent = document.querySelector('.rules-content')
        this.btnPlayAgain = document.querySelector('.btn-play-again')
    }

    /**
    * Adds event listeners to interactice elements in the game
    */
    initEventListeners() {
        this.tokens.forEach(token => {
            token.addEventListener('click', this.tokenClickEventHandler.bind(this))
        })
        this.btnPlayAgain.addEventListener('click', this.playAgainClickHandler.bind(this))
        this.modeToggle.addEventListener('click', this.modeToggleClickHandler.bind(this))
    }

    /**
    * Initialize game settings like score, header image and rule image based on current game mode
    */
    initGame() {
        this.data = new DataStore()
        const isBonusMode = this.data.read(this.data.IS_BONUS_MODE_KEY)
        this.updateDOMMode(isBonusMode)
        this.updateImages(isBonusMode)
        const score = this.calculatePoints(this.data.currentScore, true)
        this.score.textContent = score
    }
    
    /**
    * Randomly decides if player wins or loses current round
    * @returns {Boolean}
    */
    isPlayerWins() {
        return Math.random() < 0.5;
    }
    
    /**
    * The callback to handle clicking the logo and switched game modes.
    * This will adjust the score and header/rule images also
    */
    modeToggleClickHandler() {
        const isBonusMode = !this.data.read(this.data.IS_BONUS_MODE_KEY)
        this.data.save(this.data.IS_BONUS_MODE_KEY, isBonusMode)
        this.updateDOMMode(isBonusMode)
        this.updateImages(isBonusMode)
        const score = this.calculatePoints(this.data.currentScore, true)
        this.score.textContent = score
    }

    /**
    * Resets the board for next round after player clicks the "Play Again" button
    * @param {Event} evt - The click event
    */
    playAgainClickHandler(evt) {

        // Remove classes on respective HTML elements
        document.querySelector('.btn-token.winner')
            .classList.remove(this.CLASS_WINNER)
        this.stageBackground.classList.remove(this.CLASS_HIDDEN)
        this.tokens.forEach(token => {
            token.classList.remove(
                this.CLASS_HIDDEN,
                this.CLASS_HOUSE_CHOICE,
                this.CLASS_PLAYER_CHOICE,
                this.CLASS_RESULT_VISIBLE,
            )
        })

        // Restore initial classes to respective HTML elements
        this.result.classList.add(this.CLASS_HIDDEN)
        this.playerChoiceLabel.classList.add(this.CLASS_HIDDEN)
        this.houseChoiceLabel.classList.add(this.CLASS_HIDDEN)

        // Remove player/house choice classes
        this.playerChoiceLabel.classList.remove(this.CLASS_RESULT_VISIBLE)
        this.houseChoiceLabel.classList.remove(this.CLASS_RESULT_VISIBLE)

        // Reset result text and re-enable tokens' clickable state
        this.resultHeading.textContent = ''
        this.toggleTokenEnabledState(true)

        // Re-enable game mode switching
        this.modeToggle.disabled = false
    }

    /**
    * Set the match result, adjust score, and inform player
    * @param {Event} evt - The click event
    */
    async setMatchResult(evt) {

        // Result announcement setup
        const playerToken = evt.currentTarget
        this.toggleTokenEnabledState(false)
        this.setPlayerToken(playerToken)
        this.hideOtherTokens()
        this.toggleBackground(false)
        const isWin = this.isPlayerWins()

        await this.delay(600)
        
        // Show player's choice label
        this.playerChoiceLabel.classList.remove(this.CLASS_HIDDEN)

        await this.delay(1500)

        // Reveal the house's choice label and house token silhouette
        this.houseChoiceLabel.classList.remove(this.CLASS_HIDDEN)
        const houseToken = isWin ? this.getHouseLossToken() : this.getHouseWinToken()
        houseToken.classList.add(this.CLASS_HOUSE_CHOICE, this.CLASS_MASKED)
        houseToken.classList.remove(this.CLASS_HIDDEN)

        await this.delay(1500)

        // Reveal the house's choice token
        houseToken.classList.remove(this.CLASS_MASKED)

        await this.delay(1000)

        // Adjust/save points
        const points = this.calculatePoints(isWin ? 1 : -1)
        this.data.save(this.data.currentScoreKey, points)
        this.score.textContent = points

        // Display win/lose message, shift token position, and show play again button
        playerToken.classList.add(this.CLASS_RESULT_VISIBLE)
        houseToken.classList.add(this.CLASS_RESULT_VISIBLE)
        this.playerChoiceLabel.classList.add(this.CLASS_RESULT_VISIBLE)
        this.houseChoiceLabel.classList.add(this.CLASS_RESULT_VISIBLE)
        isWin
            ? playerToken.classList.add(this.CLASS_WINNER)
            : houseToken.classList.add(this.CLASS_WINNER)
        this.setResult(isWin ? this.WIN_TEXT : this.LOSE_TEXT)
    }

    /**
    * Sets a token as the player's choice token
    * @param {Element} token - The token to make the player's
    */
    setPlayerToken(token) {
        this.playerToken = this.currentTokenTypes
            .find(({ type }) => token.classList.contains(type))
        token.classList.add(this.CLASS_PLAYER_CHOICE)
    }

    /**
    * Set game round result text and show
    * @param {Element} token - The token to make the player's
    */
    setResult(text) {
        this.resultHeading.textContent = text
        this.result.classList.remove(this.CLASS_HIDDEN)
    }

    /**
    * Add/remove "bonus" class from HTML element based on current game mode
    * @param {Element} token - The token to make the player's
    */
    updateDOMMode(isBonusMode) {
        isBonusMode
            ? this.html.classList.add(this.CLASS_MODE_BONUS)
            : this.html.classList.remove(this.CLASS_MODE_BONUS)
    }

    /**
    * Adjust logo and rule content images based on game's current mode
    * @param {Boolean} isBonusMode - Whether the game is in bonus mode or not
    */
    updateImages(isBonusMode) {
        const modeText = isBonusMode ? 'BONUS' : 'NORMAL'
        this.logo.src = this[`LOGO_SRC_${modeText}`]
        this.logo.alt = this[`LOGO_ALT_TEXT_${modeText}`]
        this.rulesContent.src = this[`RULES_SRC_${modeText}`]
        this.rulesContent.alt = this[`RULES_ALT_TEXT_${modeText}`]
    }

    /**
    * Toggle visibility of token background image
    * @param {Boolean} isVisible - Whether the background image is visible or not
    */
    toggleBackground(isVisible = null) {
        if(isVisible === null) {
            this.stageBackground.classList.contains(this.CLASS_HIDDEN)
                ? this.stageBackground.classList.remove(this.CLASS_HIDDEN)
                : this.stageBackground.classList.add(this.CLASS_HIDDEN)
        } else {
            isVisible
                ? this.stageBackground.classList.remove(this.CLASS_HIDDEN)
                : this.stageBackground.classList.add(this.CLASS_HIDDEN)
        }
    }

    /**
    * Toggle the ability to switch game modes
    * @param {Boolean} isEnabled - Whether the mode switching is enabled or not
    */
    toggleTokenEnabledState(isEnabled = null) {
        this.tokens.forEach(token => {
            token.disabled = isEnabled === null
                ? !token.disabled
                : !isEnabled
        })
    }

    /**
    * The event handler for user clicking on a token
    * @param {Event} evt - The click event
    */
    tokenClickEventHandler(evt) {
        this.modeToggle.disabled = true
        this.setMatchResult(evt)
    }

    /**
    * Calculate the points for the game
    * @param {Number} points - The points to process
    * @param {Boolean} reset - Whether to reset the points or not
    * @returns {Number}
    */
    calculatePoints(points, reset = false) {
        return reset
            ? points
            : Math.max(this.data.currentScore + points, 0)
    }
}

/**
 * Create new Rules instance
 */
const rules = new Rules()

/**
 * Create new Game instance
 */
const game = new Game()