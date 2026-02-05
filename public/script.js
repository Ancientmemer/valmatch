let userId = null;
let poller = null;

async function join() {
  const age = document.getElementById("age").checked;
  const gender = document.getElementById("gender").value;
  const ig = document.getElementById("ig").value.trim();
  const status = document.getElementById("status");

  if (!age || !gender || !ig) {
    alert("Please complete all fields");
    return;
  }

  status.textContent = "💗 Waiting for your Valentine...";
  const res = await fetch("/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gender, ig })
  });
  const data = await res.json();
  userId = data.userId;

  poller = setInterval(check, 5000); // auto refresh every 5s
}

async function check() {
  const status = document.getElementById("status");
  const heart = document.getElementById("heart");

  const res = await fetch(`/status/${userId}`);
  const data = await res.json();

  if (data.matched) {
    clearInterval(poller);
    heart.classList.remove("hidden");
    status.innerHTML =
      `🎉 You got a Valentine!<br><b>@${data.ig}</b><br>
       Message them on Instagram 💖`;
  } else {
    status.textContent =
      "⏳ No partner available right now. Please wait…";
  }
}
