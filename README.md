Flag Football Playbook Web App
This is a dynamic web application designed for a high school girls' flag football coach to select and display plays on a tablet during games. It allows for live combination of formations, plays, and modifiers to react to defensive alignments in real-time.

Features
Dynamic Play Calling: Select from a list of formations and plays to instantly see the play drawn on a virtual field.

Defensive Zone Filtering: Tap on a defensive zone on the field to filter and show only the plays that are designed to attack that specific area.

Hand Signal Display: Automatically shows the correct hand signals for the selected formation and play combination.

Modifier Support: Apply modifiers like "Max" protection to change player assignments on the fly.

Expandable Playbook: Easily add new formations, plays, and signals by editing the playbook.js data file.

Project Structure
/
|-- signals/          # Folder for hand signal images
|-- index.html        # Main application page (the view)
|-- style.css         # All styling for the application
|-- playbook.js       # The "brains" - all playbook data (formations, plays)
|-- app.js            # The core application logic (the controller)
|-- README.md         # Project information

How to Add to the Playbook
All plays and formations are stored in the playbook.js file. To add a new play, follow the existing structure.

Add a new formation: In the formations object, add a new key (e.g., "Bunch Lt") and define the starting {x, y} coordinates for each player.

Add a new play: In the plays object, add a new key (e.g., "Shallows") and define the SVG path for each player's route. Crucially, also add the zoneTargets array to specify which defensive areas the route attacks.

Deployment on GitHub Pages
Initialize Git: Open a terminal in your project folder and run git init.

Create a New Repository on GitHub: Go to your GitHub account and create a new, empty repository. Do not initialize it with a README or .gitignore.

Link Your Local Repo: Back in your terminal, run the commands GitHub provides to link your local folder to the remote repository. It will look something like this:

git remote add origin [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
git branch -M main

Add and Commit Your Files:

git add .
git commit -m "Initial commit of playbook app"

Push to GitHub:

git push -u origin main

Activate GitHub Pages:

In your repository on the GitHub website, go to Settings -> Pages.

Under Source, select the main branch.

Click Save.

View Your App: It may take a minute or two, but your app will be live at https://your-username.github.io/your-repo-name/.