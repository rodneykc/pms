// Script to find and kill a process using a specific port
const { exec } = require('child_process');
const readline = require('readline');

const PORT = 3001; // Default port to check

// Function to kill a process by PID
function killProcess(pid) {
    console.log(`Attempting to kill process ${pid}...`);
    exec(`taskkill /F /PID ${pid}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error killing process: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error: ${stderr}`);
            return;
        }
        console.log(`Successfully killed process ${pid}`);
        console.log('You can now start the server.');
    });
}

// Find process using the port
exec(`netstat -ano | findstr :${PORT}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error finding process: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Error: ${stderr}`);
        return;
    }

    const lines = stdout.trim().split('\n');
    if (lines.length === 0 || lines[0] === '') {
        console.log(`No process found using port ${PORT}`);
        return;
    }

    console.log(`Found ${lines.length} process(es) using port ${PORT}:`);
    lines.forEach((line, index) => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        console.log(`[${index + 1}] PID: ${pid} - ${line.trim()}`);
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('\nEnter the number of the process to kill (or press Enter to cancel): ', (answer) => {
        if (answer && !isNaN(answer) && answer > 0 && answer <= lines.length) {
            const pid = lines[answer - 1].trim().split(/\s+/).pop();
            killProcess(pid);
        } else {
            console.log('Operation cancelled.');
        }
        rl.close();
    });
});
