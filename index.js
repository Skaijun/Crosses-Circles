class App {
  constructor(selectedHtmlElement) {
    this.selectedHtmlElement = selectedHtmlElement || document.body;
    this.renderDOM();
    this.resetEvent = this.resetEvent.bind(this);
    this.changeGameMode = this.changeGameMode.bind(this);
    this.squareClickEvent = this.squareClickEvent.bind(this);
    this.eventsHandler();
    this.fields = {
      circles: [],
      crosses: [],
      occupied: [],
      winCombo: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7],
      ],
    };
    this.moveFor = "Cross";
    this.isGameFinished = false;
    this.isGameModePvC = true;
  }

  renderDOM() {
    let outputDOM = "";
    for (let i = 1; i < 10; i++) {
      outputDOM += `<div class='square' data-index="${i}"></div>`;
    }
    $(this.selectedHtmlElement).html(outputDOM);
    this.reloadBtn = $("#reload")[0];
    this.modeChangeBtn = $("#game-mode")[0];
  }

  eventsHandler() {
    this.selectedHtmlElement.addEventListener("click", this.squareClickEvent);
    this.reloadBtn.addEventListener("click", this.resetEvent);
    this.modeChangeBtn.addEventListener("click", this.changeGameMode);
  }

  squareClickEvent() {
    let el = $(event.target);
    let elIndex = el.data("index");
    let isFieldOccupied = this.fields.occupied.some(
      (fieldIndex) => fieldIndex === elIndex
    );
    if (el.hasClass("square") && !isFieldOccupied && !this.isGameFinished) {
      if (this.moveFor === "Cross") {
        el.html('<i class="fas fa-times"></i>');
        this.fields.crosses.push(elIndex);
        this.fields.occupied.push(elIndex);
        this.checkForWin("Cross", "crosses");
        if (
          !this.isGameFinished &&
          this.fields.occupied.length < 9 &&
          this.isGameModePvC
        ) {
          this.moveFor = "Circle";
          this.botMoveForCircles();
        } else {
          this.moveFor = "Circle";
        }
      } else {
        el.html('<i class="far fa-circle"></i>');
        this.fields.circles.push(elIndex);
        this.fields.occupied.push(elIndex);
        this.checkForWin("Circle", "circles");
        this.moveFor = "Cross";
      }
    }
  }

  botMoveForCircles() {
    let cirleMoveField = null;

    do {
      cirleMoveField = Math.floor(Math.random() * 9) + 1;
    } while (this.fields.occupied.includes(cirleMoveField));

    setTimeout(() => {
      let el = $("div").find(`[data-index="${cirleMoveField}"]`);
      el.html('<i class="far fa-circle"></i>');
      this.fields.circles.push(cirleMoveField);
      this.fields.occupied.push(cirleMoveField);
      this.checkForWin("Circle", "circles");
      this.moveFor = "Cross";
    }, 1000);
  }

  checkForWin(whoseTurn, arr) {
    this.fields.winCombo.forEach((winArr, i) => {
      if (winArr.every((key) => this.fields[arr].includes(key))) {
        this.isGameFinished = true;
        this.markVictoryFields(this.fields.winCombo[i]);
      }
    });

    if (this.isGameFinished) {
      setTimeout(() => {
        alert(`${whoseTurn} player won!!`);
      }, 600);
    }

    if (!this.isGameFinished && this.fields.occupied.length === 9) {
      return alert("Вead heat!!!!!!");
    }
  }

  markVictoryFields(arr) {
    arr.forEach((number) => {
      let el = $("div").find(`[data-index="${number}"]`);
      el.addClass("victory");
    });
  }

  resetEvent() {
    this.renderDOM();
    this.fields.circles = [];
    this.fields.crosses = [];
    this.fields.occupied = [];
    this.moveFor = "Cross";
    this.isGameFinished = false;
  }

  changeGameMode() {
    this.isGameModePvC = !this.isGameModePvC;
    if (this.isGameModePvC) {
      $("#game-mode-pick").html("Mode: Player versus Computer");
    } else {
      $("#game-mode-pick").html("Mode: Player versus Player");
    }
  }
}

const myApp = new App($("#app-wrap")[0]);
