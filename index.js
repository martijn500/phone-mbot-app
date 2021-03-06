(function() {
    function pageLoad() {

        // Check the current part of Mbot
        let noBluetooth = document.getElementById("noBluetooth");
        let stepConnect = document.getElementById("stepConnect");
        let stepControl = document.getElementById("stepControl");
        // Check if the bluetooth is available
        if (navigator.bluetooth == undefined) {
            console.error("No navigator.bluetooth found.");
            stepConnect.style.display = "none";
            noBluetooth.style.display = "flex";
        } else {
            // Display the connect button
            stepConnect.style.display = "flex";
            noBluetooth.style.display = "none";
            let mBot = require("./mbot/mbot");

            // Check the connection
            document.getElementById("connectBtn").addEventListener('click', () => {
                // Request the device
                mBot.request()
                    .then(() => {
                        // Connect to the mbot
                        return mBot.connect();
                    })
                    .then(() => {
                        // Connection is done, we show the controls
                        stepConnect.style.display = "none";
                        stepControl.style.display = "flex";

                        let partBtn = document.querySelector('.part-button');
                        
                        // Control the robot by buttons
                        let btnUp = document.getElementById('btnUp');
                        let btnDown = document.getElementById('btnDown');
                        let btnLeft = document.getElementById('btnLeft');
                        let btnRight = document.getElementById('btnRight');

                        btnUp.addEventListener('touchstart', () => { mBot.processMotor(-125, 125) });
                        btnDown.addEventListener('touchstart', () => { mBot.processMotor(125, -125) });
                        btnLeft.addEventListener('touchstart', () => { mBot.processMotor(125, 125) });
                        btnRight.addEventListener('touchstart', () => { mBot.processMotor(-125, -125) });

                        btnUp.addEventListener('touchend', () => { mBot.processMotor(0, 0) });
                        btnDown.addEventListener('touchend', () => { mBot.processMotor(0, 0) });
                        btnLeft.addEventListener('touchend', () => { mBot.processMotor(0, 0) });
                        btnRight.addEventListener('touchend', () => { mBot.processMotor(0, 0) });
                        
                        
                    })
            });



        }

    }



    window.addEventListener('load', pageLoad);

})();