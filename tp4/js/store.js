var contactStore = (function () {
  let list = JSON.parse(localStorage.getItem("contactList")) || [];

  return {
    add: function (_name, _firstname, _date, _adress, _mail) {
      list.push({ name: _name, firstname: _firstname, date: _date, adress: _adress, mail: _mail });
      localStorage.setItem("contactList", JSON.stringify(list));
    },
    getList: () => list,
    reset: function () {
      list = [];
      localStorage.removeItem("contactList");
    }
  };
})();