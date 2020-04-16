function Member(name) {
  this.name = name;
  this.chatroom = null;
}

Member.prototype = {
  send: function (message, toMember) {
    this.chatroom.send(message, this, toMember);
  },
  receive: function (message, fromMember) {
    console.log(`${fromMember.name} to ${this.name}: ${message}`);
  }
}

function Chatroom() {
  this.members = {};
}

Chatroom.prototype = {
  addMember: function (member) {
    this.members[member.name] = member;
    member.chatroom = this;
  },
  send: function (message, fromMember, toMember) {
    toMember.receive(message, fromMember);
  }
}

const chatroom = new Chatroom();
const bruce = new Member('bruce');
const frank = new Member('frank');
const alice = new Member('alice');

chatroom.addMember(bruce);
chatroom.addMember(frank);
chatroom.addMember(alice);

bruce.send('Hey frank', frank);