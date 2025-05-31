![image](https://github.com/user-attachments/assets/0acf705b-43fd-46d1-8d94-c9e53c92bded)
# VieFilm - Website to book movie tickets online

<table>
<tr>
<td>
  The online movie ticket booking website project is built with ReactJS for the frontend and NodeJS for the backend, integrating Tailwind CSS to create a modern and responsive interface.
</td>
</tr>
</table>

## Demo

You can experience the application at: [https://viefilm.vercel.app/](https://viefilm.vercel.app/)

## Technologies Used

- **Frontend**:
    - ReactJS
    - Tailwind CSS
- **Backend**:
    - NodeJS

## Project Description

VieFilm-Reactjs is a comprehensive movie ticket booking system, offering a convenient booking experience for users and providing powerful management tools for administrators and cinema staff.

## Key Features

### For Users

- **Login and Registration:**
    - Supports user login and registration with captcha verification.
    - Uses email to send account verification links, password reset links, and successful booking notifications.
- **Search and View Showtimes:**
    - View flexible showtimes by cinema, movie, and specific date.
- **Smart Seat Booking System:**
    - Implements smart seat booking logic to avoid leaving odd single seats in the middle or at the ends, ensuring optimized seating utilization.
    - Real-time seat holding mechanism to ensure fairness and accuracy during the booking process, preventing overlapping bookings.
- **Online Payment:**
    - Integrates online payment via VNPay, providing convenience and security for users.

### For Administrators (Admin) and Staff

**Admin:**
- **Cinema Management:**
    - Has full authority to manage all cinemas within a province/city, including adding/editing screening rooms and showtimes.
- **Statistics and Reports:**
    - View revenue reports for all cinemas.
- **Content Management:**
    - Manage movies, discount codes, and combos.
- **Personnel Management:**
    - Manage staff information.
- **Seat Map Customization:**
    - Customize the seat layout for each screening room, including seat prices and special rules.

**Staff:**
- **Scope of Authority:**
    - Can only perform operations within the scope of their assigned cinema.
- **Showtime Management:**
    - Create new showtimes.
- **Revenue Tracking:**
    - View internal revenue for their cinema.
- **Ticket Printing:**
    - Controlled ticket printing function to ensure accuracy and security.

## Installation and Setup

To install and run the project locally, follow these steps:

1.  **Clone repository:**
    ```bash
    git clone https://github.com/lhv129/VieFilm-Reactjs.git
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    
3.  **Install backend:**
   
    See more download and run api backend project here: https://github.com/lhv129/VieFilm-Api

4.  **Change baseUrl:**
   
    In the apis/axiosClient.js folder you need to change baseUrl: 'apis backend is running'

5.  **Run the application:**
    ```bash
    # Start the frontend (in the project root directory)
    npm run dev
    ```

## Contributing

All contributions to improve the project are welcome. Please create an issue or pull request on GitHub.

## Contact

If you have any questions, please contact:

- **GitHub:** [lhv129](https://github.com/lhv129)

---
