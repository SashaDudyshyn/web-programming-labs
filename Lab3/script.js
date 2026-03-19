(function () {
    var names = ["Bill", "John", "Jen", "Jason", "Paul", "Frank", "Steven", "Larry", "Paula", "Laura", "Jim"];

    for (var i = 0; i < names.length; i++) {
        var firstLetter = names[i].charAt(0).toLowerCase();

        if (firstLetter === 'j') {
            byeSpeaker.speak(names[i]);
        } else {
            helloSpeaker.speak(names[i]);
        }
    }

    console.log("Додатковий функціонал: Імена, що закінчуються на літеру 'n'");
    
    for (var i = 0; i < names.length; i++) {
        var name = names[i];
        var lastLetter = name.charAt(name.length - 1).toLowerCase();
        
        if (lastLetter === 'n') {
            console.log("Спеціальне повідомлення: " + name + " має 'n' в кінці імені!");
        }
    }
})();
