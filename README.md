<a id="readme-top"></a>
# RentEase - Find Your Next Home with Ease :house_with_garden:

## About The Project

![RentEase](https://github.com/user-attachments/assets/6bdb4435-3490-43a0-a98f-4fa7cdbd8929)

RentEase is a modern rental platform designed to make finding, listing, and managing properties easier than ever. Whether you're a tenant searching for the perfect place or a property owner looking to rent out with confidence, RentEase offers a seamless, user-friendly experience tailored to your needs.

With features like smart search, real-time property requests, favorites tracking, and location mapping, RentEase simplifies the entire renting journey — from discovery to move-in.

*This is the project for the module Software Engineering at NTU


### Built With
* [![Django][Django-badge]][Django-url]
* [![ReactJS][ReactJS-badge]][ReactJS-url]

[Django-badge]: https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green
[Django-url]: https://www.djangoproject.com/
[ReactJS-badge]: https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=for-the-badge
[ReactJS-url]: https://react.dev/

## Getting Started
This is how you create a local version of this platform.

Clone this repository
   ```sh
   https://github.com/ngvanthanggit/SC2006-Project.git
   ```
### Backend Setup
1. Create Virtual Environment
   ```sh
   python -m venv myenv
   ```
2. Activate the virtual environment
   ```sh
   source myenv/bin/activate
   ```
3. Install all required packages for the backend
   ```sh
   pip install -r requirements.txt
   ```
   or
   ```sh
   python -m pip install -r requirements.txt
   ```
4. Direct your terminal to /backend folder
   ```sh
   cd backend
   ```
5. Run migration(s) (if needed)
   ```sh
   python manage.py makemigrations
   ```
   then migrate/apply the changes
   ```sh
   python manage.py migrate
   ```
6. Run server locally
   ```sh
   python manage.py runserver
   ```
   or (with custom port number)
   ```sh
   python manage.py runserver <port number>
   ```
### Frontend Setup
1. Direct your terminal to /frontend folder
   (if needed) if you are still inside the /backend, you will need to go back to the root folder
   ```sh
   cd ..
   ```
   now go to the /frontend folder
   ```sh
   cd frontend
   ```
2. Install the required packages for frontend
   ```sh
   npm install
   ```
3. Run the frontend
   ```sh
   npm run dev
   ```
Now you are able to access the website locally!

:hut: :houses: :derelict_house: :house_with_garden:
## Contact

Thang Nguyen Van - [@ngvanthangig](https://www.instagram.com/ngvanthangig/) - thangitcbg@gmail.com

Project Link: [https://github.com/ngvanthanggit/SC2006-Project](https://github.com/ngvanthanggit/SC2006-Project)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
