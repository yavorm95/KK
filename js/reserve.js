var Reserve = []
var Time = [];
Time.push({});
Time.days = [];
var dayPrice = 1;
var error = false;
        function MakeReserve(form, check){
            error = false;
            ValidateData(form);
            CalculPrice(Reserve.room_type, Reserve.duration, Reserve.room_quant);
            CheckReserve(check);
        }
        
        function GetData(i) {
             return reserve.elements[i].value;
        }
        function ValidateData(target){
            var valid = 0;
            var form = document.getElementById(target);
            var fields = form.childElementCount;
            for (var i = 0; i < fields; i++){
                if (form.elements[i].value == ''){
                    alert(`Es necesario completar el campo ${form.elements[i].name}`);
                    valid--;
                }
            }
            if (valid == 0){
                GetForm();
            }
        }
        function GetDays(year, month, day, limit){
            for (day; day <= limit; day++){
                    var dayWeek = moment([year, month, day]).day();
                    if (month == 5 || month == 6 || month == 7){
                        dayPrice += 0.4; 
                    }
                    if (dayWeek == 0 || dayWeek == 6){
                        dayPrice += 0.15;
                    }
                    Time.days.push(dayPrice);
                    dayPrice = 1;
                }
        }
        function GetName(array, name, surname){
            array.name = GetData(name);
            array.surname = GetData(surname);
        }
        function GetTime(start, end){
            while (start[0] <= end[0]){
                if (start[0] == end[0]){
                    if (start[1] > end[1]){
                        alert('meses');
                        alert("Error: Datos de fecha inconsistentes");
                        error = true;
                    }
                    else {
                        while (start[1] <= end[1]){
                            if (start[1] == end[1]){
                                if (start[2] > end[2]){
                                    alert('dias');
                                    alert("Error: Datos de fecha inconsistentes");
                                    error = true;
                                }
                                else {
                                    GetDays(start[0], start[1], start[2], end[2]);  
                                }
                            }
                            else {
                                var daysMonth = moment(start[1] + 1, 'MM').daysInMonth();
                                GetDays(start[0], start[1], start[2], daysMonth);
                                start[2] = 1;
                            }
                            start[1]++;
                        }  
                    }
                }
                else {
                    for (start[1]; start[1] < 12; start[1]++){
                        var daysMonth = moment(start[1] + 1, 'MM').daysInMonth();
                        GetDays(start[0], start[1], start[2], daysMonth);
                        start[2] = 1;
                    }
                }
                start[0]++;
                start[1] = 0;
            }
        }
        function GetDuration(array, first, last, inFormat, outFormat){
            Time.days = [];
            var init = moment(GetData(first), inFormat);
            var end = moment(GetData(last), inFormat);
            array.start_date = init.format(outFormat);
            array.end_date = end.format(outFormat);
            init = init.toArray();
            end = end.toArray();
            GetTime(init, end);
            array.duration = Time.days.length - 1;
        }
        function GetTypeAndNumb(array, type, number){
            array.room_type = GetData(type);
            array.room_quant = GetData(number);
            for (var i = 0; i < array.room_quant; i++){
                array[i] = i + 1;
            }
        }
        function GetDayPrice(array, days){
            array.dayPrice = 0;
            for (var i = 0; i < (days.length - 1); i++){
                array.dayPrice += days[i];
            }
        } 
        function GetForm() {
            var reserve = document.getElementById('reserve');
            Reserve.push({});
            //Name
            GetName(Reserve, 'Nombre', 'Apellidos');
            //Time (Moment.js)
            GetDuration(Reserve, 'Inicio', 'Final', 'YYYY-MM-DD', 'dddd, DD MMMM YYYY');
            //Type & Num of rooms
            GetTypeAndNumb(Reserve, 'Tipo', 'Número de habitaciones');
            //Get the price of every day
            GetDayPrice(Reserve, Time.days);
        }
        function CalculPrice(type, time, number){
            var base = 0;
            var plus = 0;
            //Price mod by time
            if (time == 1){
                plus += 0.2;
            }
            else {
                if (time >= 7){
                   plus -= 0.1; 
                }
            }
            //Base set by type
            if (type == 'Simple'){
                base = 30;
            }
            else {
                if (type == 'Doble'){//
                    base = 50;
                }
                else {
                    if (type == 'Familiar'){
                        base = 70;
                    }
                    else {
                        base = 90;
                    }
                }
            }
            //Total
            Reserve.TotalPrice = Math.round((base * Reserve.dayPrice * (1 + plus)) * number);
        }
        function CheckConfirm(){
            alert('Su reserva ha sido confirmada');
            window.location.href='reserva.html';
        }
        function CheckReserve(checker) {
            if (error == false){
                var card = document.getElementById(checker);
                card.innerHTML = `
                    <h2>Reserva</h2>
                    <div class="cont_hor2">
                        <div class="fields">
                            <h4>Nombre</h4>
                            <p class="data">${Reserve.name} ${Reserve.surname}</p>
                        </div>
                        <div class="fields">
                            <h4>Duración</h4> 
                            <p class="data">${Reserve.duration} días</p>
                        </div>
                        <div class="fields">
                            <h4>Tipo</h4>
                            <p class="data">${Reserve.room_type}</p>
                        </div>
                        <div class="fields">
                            <h4>Habitaciones</h4>
                            <p class="data">${Reserve.room_quant}</p>
                        </div>
                    </div>
                    <div class="cont_hor2">
                        <div class="fields">
                            <h4>Inicio</h4>
                            <p class="data">${Reserve.start_date}</p>
                        </div>
                        <div class="fields">
                            <h4>Final</h4> 
                            <p class="data">${Reserve.end_date}</p>
                        </div>
                        <div class="fields">
                            <h4>Precio</h4>
                            <p class="data">${Reserve.TotalPrice}€</p>
                        </div>
                    </div>
                        <button onclick="CheckConfirm()">Confirmar Reserva</button>
                        <div class="fields">
                        <h4>Números:</h4> `
                for (var i = 0; i < Reserve.room_quant; i++){
                    card.innerHTML += `<div class="reserved_rooms">${Reserve[i]}</div>`;
                }
                card.innerHTML += `<BR><BR>`;
            }    
        }
            