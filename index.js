class App {
  constructor(selectedHtmlElement) {
    this.selectedHtmlElement = selectedHtmlElement || document.body;
    this.renderDOM();
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
  }

  renderDOM() {
    let outputDOM = "";
    for (let i = 1; i < 10; i++) {
      outputDOM += `<div class='square' data-index="${i}"></div>`;
    }
    $(this.selectedHtmlElement).html(outputDOM);
  }

  eventsHandler() {
    this.selectedHtmlElement.addEventListener("click", this.squareClickEvent);
  }

  squareClickEvent() {
    let el = $(event.target);
    let elIndex = el.data("index");
    let isFieldOccupied = this.fields.occupied.some(
      (fieldIndex) => fieldIndex === elIndex
    );
    if (el.hasClass("square") && !isFieldOccupied && !this.isGameFinished) {
      if (this.moveFor === "Circle") {
        el.html('<i class="far fa-circle"></i>');
        this.fields.circles.push(elIndex);
        this.fields.occupied.push(elIndex);
        this.checkForWin("Circle", "circles");
        this.moveFor = "Cross";
      } else {
        el.html('<i class="fas fa-times"></i>');
        this.fields.crosses.push(elIndex);
        this.fields.occupied.push(elIndex);
        this.checkForWin("Cross", "crosses");
        this.moveFor = "Circle";
      }
    }
  }

  checkForWin(whoseTurn, arr) {
    if (this.fields.occupied.length === 9) {
      return alert("Вead heat!!!!!!");
    }

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
  }

  markVictoryFields(arr) {
    arr.forEach((number) => {
      let el = $("div").find(`[data-index="${number}"]`);
      el.addClass("victory");
    });
  }
}

const myApp = new App($("#app-wrap")[0]);
