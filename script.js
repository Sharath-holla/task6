document.addEventListener("DOMContentLoaded", function () {
    const toggleButtons = document.querySelectorAll(".faq li span.toggle-btn");
    toggleButtons.forEach(button => {
        button.addEventListener("click", function () {
            const answer = this.nextElementSibling;

            if (answer.style.display === "block") {
                answer.style.display = "none";
                this.textContent = "Toggle";
            } else {
                answer.style.display = "block";
                this.textContent = "Close";
            }
        });
    });


    let slideIndex = 0;
    const slides = document.querySelectorAll(".product-card img");
    const totalSlides = slides.length;

    function showSlide(index) {

        slides.forEach((slide, i) => {
            slide.style.display = "none";
        });


        slides[index].style.display = "block";
    }

    function nextSlide() {
        slideIndex = (slideIndex + 1) % totalSlides;
        showSlide(slideIndex);
    }

    function prevSlide() {
        slideIndex = (slideIndex - 1 + totalSlides) % totalSlides;
        showSlide(slideIndex);
    }

    showSlide(slideIndex);
    setInterval(nextSlide, 3000);
    document.querySelector("#next-slide").addEventListener("click", nextSlide);
    document.querySelector("#prev-slide").addEventListener("click", prevSlide);
});

