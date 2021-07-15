require('dotenv').config()

const { inquirerMenu, pausa, leerInput, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

// console.log(process.env);
const main = async() => {

    const busquedas = new Busquedas();
    let opt;
    do {
        
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                // Mostrar mensaje
                const termino = await leerInput('Ciudad: ');

                // Buscar los lugares
                const lugares = await busquedas.ciudad(termino);

                // Seleccionar el lugar
                const idSeleccionado = await listarLugares(lugares);

                if ( idSeleccionado === '0' ) continue;
                
                const lugarSeleccionado = lugares.find( lugar => lugar.id === idSeleccionado  )
                
                // Guardar en DB
                busquedas.agregarHistorial( lugarSeleccionado.nombre );
                
                // Clima
                const clima = await busquedas.climaLugar( lugarSeleccionado.lat, lugarSeleccionado.lng );

                // Mostrar resultados
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSeleccionado.nombre );
                console.log('Lat:', lugarSeleccionado.lng );
                console.log('Lng:', lugarSeleccionado.lat );
                console.log('Temperatura:', clima.temp );
                console.log('Mínima:', clima.min );
                console.log('Máxima:', clima.max );
                console.log('Como esta el clima:', clima.desc.green );
                

                break;
        
            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log(`${ idx } ${ lugar }`);
                }) 

                break;
        }
        
        if (opt !== 0) await pausa();
        

    } while (opt !== 0);




}

main();