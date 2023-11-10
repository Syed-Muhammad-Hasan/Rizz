# Rizz
This repository contains codebase for assignments of Data Visualization course at UniGe.

Group members: Syed Muhammad Hasan, Muhammad Ahsan Iqbal

# Steps for making it working on your local machine:
<ol>
  <li>Make sure you have installed Python, Jupyter notebook, pandas, numpy, npm.</li>
  <li>Install live server npm package by executing this command <b>npm install -g live-server</b>. Details about the live server package can be found <a href="https://www.npmjs.com/package/live-server">here</a></li>
  <li>Clone the project on your local machine.</li>
  <li>For the 1st bar graph, representing abundance of trees by city, the dataset is already processed. If you wish you to do again, open the <b>Assignment-1-Preprocessor.ipynb</b> file in jupyter notebook and execute the repective cell. Assumptions for the dataset preprocessing can be found in the notebook</li>
  <li>For Heatmap, execute the <b>processHeatMapFile</b> function in the <b>Assignment-1-Preprocessor.ipynb</b> and pass the list with the name of cities you wish to get the data for. Make sure to check the dependencies for the method.</li>
  <li>To run the webpage from local machine, do the following steps:</li>
  <ol>
    <li>Open command prompt.</li>
    <li>Navigate to the repository directory you cloned.</li>
    <li>Run <b>live-server</b> command which will open the index.html file in your browser.</li>
