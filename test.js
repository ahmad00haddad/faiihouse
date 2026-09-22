
        function setDelivery(val) {
  if(navigator.vibrate) navigator.vibrate(30);
  playTick();
          document.querySelectorAll('#deliveryDaysWrapper .seg-btn').forEach(b => {
            b.classList.remove('active');
            if(b.getAttribute('data-val') === val) b.classList.add('active');
          });
          document.getElementById('deliveryDays').value = val;
          updateQuote();
        }
      