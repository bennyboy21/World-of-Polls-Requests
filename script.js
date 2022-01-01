const firebaseConfig = {
    apiKey: "AIzaSyCGjxp0X4O3bhReLgNeMpauJfOheU9ugmc",
    authDomain: "the-world-of-polls.firebaseapp.com",
    projectId: "the-world-of-polls",
    storageBucket: "the-world-of-polls.appspot.com",
    messagingSenderId: "421676610239",
    appId: "1:421676610239:web:989112245dc95198840c0a",
    measurementId: "G-81KSLMFQ0J"
};

firebase.initializeApp(firebaseConfig);

var PollCount;
var arrayOfPolls = [];

firebase.database().ref("Requests/").once('value', function(snapshot) {
    snapshot.forEach(
        function(ChildShapshot) {
            var currentIndex = ChildShapshot.val().Index;
            arrayOfPolls.push(currentIndex);
        }
    )
    console.log(arrayOfPolls)
})

var index = 1

firebase.database().ref("Requests/").on('child_added', function(snapshot) {
    var html = "";
    if(html == "") {
        html += "<div id='poll-Request-Container'>";
        html += '<div id="poll-Topic">';
        html += snapshot.val().Topic;
        html += "</div>";
        html += "<div id='poll-Option-One'>";
        html += snapshot.val().OptionOne
        html += "</div>"
        html += "<div id='poll-Option-Two'>";
        html += snapshot.val().OptionTwo
        html += "</div>"
        html += "</div>";
        html += "<button id='poll-Accept' onclick='AcceptPoll("+index+")'>";
        html += "Accept"
        html += "</button>"
        html += "<button id='poll-Decline' onclick='DeclinePoll("+index+")'>";
        html += "Decline"
        html += "</button>"
        console.log(index)
        index++;
    }
    console.log(snapshot.val().Topic);

    document.getElementById("all-Requests").innerHTML += html;
});

firebase.database().ref("PollCount").on('value', function(snapshot) {
    PollCount = snapshot.val().Count;
})

var PollInfo = {
    Topic: null,
    OptionOne: null,
    OptionTwo: null,
    Name: null,
    Date: null
}

function AcceptPoll(i) {
    var realIndex = i - 1;
    console.log(arrayOfPolls[realIndex]);

    firebase.database().ref("Requests/" + arrayOfPolls[realIndex]).on('value', function(snapshot) {
        PollInfo.Topic = snapshot.val().Topic
        PollInfo.OptionOne = snapshot.val().OptionOne;
        PollInfo.OptionTwo = snapshot.val().OptionTwo;
        PollInfo.Name = snapshot.val().Name;
        PollInfo.Date = snapshot.val().Date;
    })

    if(PollInfo.Topic != undefined || PollInfo.Topic != null) {
        setInterval(function() {
            firebase.database().ref("Polls/" + PollCount).set({
                "OptionOne": PollInfo.OptionOne,
                "OptionTwo": PollInfo.OptionTwo,
                "Topic": PollInfo.Topic,
                "OptionOneVotes": 0,
                "OptionTwoVotes": 0,
                "Index": PollCount,
                "Likes": 0,
                "Dislikes": 0,
                "Name": PollInfo.Name,
                "Date": PollInfo.Date,
            })
        }, 300)
    
        setInterval(function() {
            window.location.reload();
        }, 1000)
    
        PollCount++;
    
        firebase.database().ref("PollCount/").set({
            "Count": PollCount
        })
    
        firebase.database().ref("Requests/").child(arrayOfPolls[realIndex]).remove();
    } else {
        alert("Error Accepting Poll. Please Try Again")
    }
}

function DeclinePoll(i) {
    var realIndex = i - 1;
    console.log(arrayOfPolls[realIndex]);
    firebase.database().ref("Requests/").child(arrayOfPolls[realIndex]).remove();
    window.location.reload();
}