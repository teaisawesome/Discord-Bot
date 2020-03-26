module.exports = {
    name: '!deleteq',
    description: 'Log a delete quest to backend.',
    execute(message, args)
    {
        const fs = require('fs');
        const logfile = 'quest-data.json';

        const loguser = `<@${message.member.id}>`;
        
        if(args.length > 1)
        {
            message.reply('Argumentumok száma nem megfelelő!')
            return -1;
        }
        if(isNaN(args[0]))
        {
            message.reply('A quest ID-nak számnak kell lennie!');
            return -1;
        }
        else
        {
            // validáció
            if( isValidQuestId(fs,logfile,args[0]) )
            {
                // törlés
                deleteQuestFromFile(fs, logfile, args[0]);
                message.reply('A(z) ' + args[0] + ' azonosítójú quest törölve lett! Törölte: ' + loguser);
            }
            else
            {
                message.reply('Nincs ilyen azonosítójú quest!');
		return -1;
            }
        }
    }
};

/**
 * Függvény annak vizsgálatára, hogy már létezik-e a paraméterben
 * megadott id, amivel törölni szeretnénk.
 * 
 * Az fs, logfile mellett vár egy id paramétert, amely alapján fog validálni.
 *
 * return true - ha van találtat
 * return false - ha nincs találat
 */
function isValidQuestId(fs, logfile, id)
{
    var data = fs.readFileSync(logfile);

    obj = JSON.parse(data);

    var result = false;

    var index = 0;

    obj.array.forEach(element => {
        if(element.id == id)
        {
            result = true;
        }
        index++;
    });

    return result;

}
/**
 * Eljárás a questek törlésére.
 * 
 * Az fs, logfile mellett vár egy id paramétert, amely alapján fog törölni.
 */
function deleteQuestFromFile(fs, logfile, id)
{
    fs.readFile(logfile, 'utf8', function readFileCallback(err, data){
		if (err){
			if(err.code == 'ENOENT'){
                console.log('error');
			}
			else{
				console.log(err);
			}
		}
        else
        {
            obj = JSON.parse(data);
            
            let index = 0;

            /*
             * Végigiterál a json objektum tömbjén, majd keresi a megfelelő indexű objektumot.
             * Ha megtalálta akkor kitörli a megtalált tömb indexe alaján.
             */
            obj.array.forEach(element => {
                if(element.id == id)
                {
                    obj.array.splice(index, 1);
                }
                index++;
            });

			json = JSON.stringify(obj);
			fs.writeFileSync(logfile, json);
		}
	});
}
