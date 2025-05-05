export default class inventory {
  constructor(scene, x, y, actions) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.actions = actions;

    this.create();
  }
  let inInventory [,];
  
  addToInvetory(item) {
      inInventory.pop(item);
  };

  removeFromInventory(item) {
    let index = inInventory.indexOf(item);
    if (index !== -1) {
      inInventory.splice(item, 1);
    };
  }
}



