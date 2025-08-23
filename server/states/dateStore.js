let today = new Date().toISOString().split("T")[0];
let selectedDate = today;

function getSelectedDate() {
    return selectedDate;
}

function setSelectedDate(date) {
    selectedDate = date;
}

module.exports = {
  getSelectedDate,
  setSelectedDate,
};