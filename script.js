// ========================================
// SUPABASE
// ========================================

const SUPABASE_URL =
    "https://kylbaytlbgvaxjahcxtj.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_TCpHUThZtQL9gzMsWRUbIQ_ih9KlhLp";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ========================================
// ELEMENT WEBSITE
// ========================================

const mainContent =
    document.getElementById("mainContent");

const openButton =
    document.getElementById("openInvitation");

const invitation =
    document.getElementById("invitation");

const backgroundMusic =
    document.getElementById("backgroundMusic");

    const musicControl =
    document.createElement("button");

musicControl.type = "button";

musicControl.textContent = "♫";


musicControl.style.cssText = `
     position: fixed;
    right: 20px;
    bottom: 20px;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    border: 2px solid #d9be88;
    background: #781317;
    color: #ffffff;
    font-size: 24px;
    cursor: pointer;
    z-index: 999999;
    display: none;
    align-items: center;
    justify-content: center;
    box-shadow: 0 5px 20px rgba(0,0,0,0.35);
`;

document.body.appendChild(
    musicControl
);

const wishForm =
    document.getElementById("wishForm");

const guestName =
    document.getElementById("guestName");

const guestWish =
    document.getElementById("guestWish");

const wishList =
    document.getElementById("wishList");

const wishSuccess =
    document.getElementById("wishSuccess");


// ========================================
// BUKA UNDANGAN
// ========================================

openButton.addEventListener(
    "click",
    function () {

        // Hilangkan button Buka Undangan
        openButton.style.display = "none";


        // PAPARKAN MUSIC BUTTON
        musicControl.style.display = "flex";


        // Mainkan lagu
        backgroundMusic.volume = 0.5;

        backgroundMusic
            .play()
            .then(function () {

                musicControl.textContent = "♫";

            })
            .catch(function (error) {

                console.log(
                    "Music error:",
                    error
                );

                musicControl.textContent = "♪";

            });


        // Scroll ke kad jemputan
        setTimeout(function () {

            invitation.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 300);

    }
);

// ========================================
// MUSIC CONTROL
// ========================================

musicControl.addEventListener(
    "click",
    function () {

        if (backgroundMusic.paused) {

         backgroundMusic
                .play()

                    musicControl.textContent = "♫";

        } else {

            backgroundMusic.pause();

            musicControl.textContent =
                "♪";

        }

    }
);

// ========================================
// COUNTDOWN
// ========================================

const weddingDate =
    new Date(
        "2026-11-21T11:00:00+08:00"
    ).getTime();


const daysElement =
    document.getElementById("days");

const hoursElement =
    document.getElementById("hours");

const minutesElement =
    document.getElementById("minutes");

const secondsElement =
    document.getElementById("seconds");

const countdownMessage =
    document.getElementById(
        "countdownMessage"
    );


function updateCountdown() {

    const now =
        new Date().getTime();

    const distance =
        weddingDate - now;


    if (distance <= 0) {

        daysElement.textContent = "00";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";

        countdownMessage.textContent =
            "Hari bahagia telah tiba ♡";

        return;
    }


    const days =
        Math.floor(
            distance /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (
                distance %
                (1000 * 60 * 60 * 24)
            ) /
            (1000 * 60 * 60)
        );


    const minutes =
        Math.floor(
            (
                distance %
                (1000 * 60 * 60)
            ) /
            (1000 * 60)
        );


    const seconds =
        Math.floor(
            (
                distance %
                (1000 * 60)
            ) /
            1000
        );


    daysElement.textContent =
        String(days).padStart(2, "0");

    hoursElement.textContent =
        String(hours).padStart(2, "0");

    minutesElement.textContent =
        String(minutes).padStart(2, "0");

    secondsElement.textContent =
        String(seconds).padStart(2, "0");

}


updateCountdown();

setInterval(
    updateCountdown,
    1000
);

// ========================================
// LOAD UCAPAN DARI SUPABASE
// ========================================

async function loadWishes() {

    wishList.innerHTML =
        "<p class='loading-wishes'>Memuatkan ucapan...</p>";


    const { data, error } =
        await supabaseClient
            .from("wishes")
            .select(
                "id, name, message, created_at"
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Load wishes error:",
            error
        );

        wishList.innerHTML =
            "<p class='loading-wishes'>Ucapan tidak dapat dimuatkan.</p>";

        return;
    }


    displayWishes(data);

}


// ========================================
// PAPARKAN UCAPAN
// ========================================

function displayWishes(wishes) {

    wishList.innerHTML = "";


    if (
        !wishes ||
        wishes.length === 0
    ) {

        wishList.innerHTML =
            "<p class='loading-wishes'>Belum ada ucapan. Jadilah yang pertama ♡</p>";

        return;
    }


    wishes.forEach(function (wish) {

        const card =
            document.createElement("div");

        card.className =
            "wish-card";


        const name =
            document.createElement("div");

        name.className =
            "wish-card-name";

        name.textContent =
            wish.name;


        const message =
            document.createElement("div");

        message.className =
            "wish-card-message";

        message.textContent =
            wish.message;


        const date =
            document.createElement("span");

        date.className =
            "wish-card-date";


        const wishDate =
            new Date(
                wish.created_at
            );


        date.textContent =
            wishDate.toLocaleDateString(
                "ms-MY",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );


        card.appendChild(name);
        card.appendChild(message);
        card.appendChild(date);

        wishList.appendChild(card);

    });

}


// ========================================
// HANTAR UCAPAN
// ========================================

wishForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const nameValue =
            guestName.value.trim();

        const wishValue =
            guestWish.value.trim();


        if (
            nameValue === "" ||
            wishValue === ""
        ) {

            return;

        }


        const submitButton =
            wishForm.querySelector(
                ".send-wish-button"
            );


        submitButton.disabled = true;

        submitButton.textContent =
            "MENGHANTAR...";


        const { error } =
            await supabaseClient
                .from("wishes")
                .insert([
                    {
                        name: nameValue,
                        message: wishValue
                    }
                ]);


        if (error) {

            console.error(
                "Submit wish error:",
                error
            );

            wishSuccess.textContent =
                "Ucapan gagal dihantar.";

            submitButton.disabled = false;

            submitButton.textContent =
                "HANTAR UCAPAN ♡";

            return;
        }


        wishForm.reset();


        wishSuccess.textContent =
            "Terima kasih atas ucapan dan doa anda ♡";


        submitButton.disabled = false;

        submitButton.textContent =
            "HANTAR UCAPAN ♡";


        await loadWishes();


        setTimeout(function () {

            wishSuccess.textContent = "";

        }, 4000);

    }
);


// ========================================
// LOAD WEBSITE
// ========================================

loadWishes();