import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as readline from 'readline';
import { Booking } from 'src/entities/booking.entity';
import { Room, RoomType } from 'src/entities/room.entity';
import { User, UserType } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
// import { getConnection, getRepository, Repository } from 'typeorm';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
  ) {}
  private currentUser: User | undefined;
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  private login(): void {
    this.rl.question('Enter email: ', (email: string) => {
      this.rl.question('Enter password: ', async (password: string) => {
        if (await this.authenticateUser(email, password)) {
          console.log('Login successful');
          if (this.currentUser.userType == UserType.ADMIN) {
            this.displayAdminMenu();
          } else {
            this.displayCustomerMenu();
          }
        } else {
          console.log('Login failed');
          this.showMainMenu();
        }
      });
    });
  }

  private signup(): void {
    this.rl.question('Enter First Name: ', (firstName: string) => {
      this.rl.question('Enter Last Name: ', (lastName: string) => {
        this.rl.question(
          'Enter User Type (a) Admin/ (c): Customer ',
          (userType: string) => {
            this.rl.question('Enter email: ', (email: string) => {
              this.rl.question('Enter password: ', async (password: string) => {
                const user = new User();
                user.email = email;
                user.password = password;
                user.firstName = firstName;
                user.lastName = lastName;
                if (userType == 'a') {
                  user.userType = UserType.ADMIN;
                } else if (userType == 'c') {
                  user.userType = UserType.CUSTOMER;
                } else {
                  console.log('Invalid Choice !');
                  this.showMainMenu();
                }
                await this.usersRepository.save(user);
                console.log(`User ${user.email} signed up`);
                this.currentUser = user;
                if (this.currentUser.userType == UserType.ADMIN) {
                  this.displayAdminMenu();
                } else {
                  this.displayCustomerMenu();
                }
              });
            });
          },
        );
      });
    });
  }

  private async authenticateUser(
    email: string,
    password: string,
  ): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { email: email, password: password },
    });
    if (user) {
      this.currentUser = user;
      return true;
    } else {
      return false;
    }
  }

  public showMainMenu(): void {
    console.log('Welcome to Seat Booker App');
    console.log('1. Login');
    console.log('2. Signup');

    this.rl.question('Enter choice: ', (choice: string) => {
      switch (choice) {
        case '1':
          this.login();
          break;
        case '2':
          this.signup();
          break;
        default:
          console.log('Invalid choice');
          this.showMainMenu();
          break;
      }
    });
  }
  public displayCustomerMenu(): void {
    console.log('\nWelcome to the Customer Menu!');
    console.log('1. Book a seat');
    console.log('2. Show my bookings');
    console.log('3. Resell my seat');
    console.log('4. Logout');

    this.rl.question('Please enter your choice: ', (choice: string) => {
      switch (choice) {
        case '1':
          this.showBookSeatMenu();
          break;
        case '2':
          this.displayBookings();
          break;
        case '3':
          // resellMySeat();
          this.displayCustomerMenu();
          break;
        case '4':
          console.log('Goodbye!');
          this.showMainMenu();
          break;
        default:
          console.log('Invalid choice!');
          this.displayCustomerMenu();
      }
    });
  }

  public displayAdminMenu(): void {
    console.log('\nWelcome to the Admin Menu!');
    console.log('1. See registered rooms');
    console.log('2. Register a new room');
    console.log('3. Logout');

    this.rl.question('Please enter your choice: ', (choice: string) => {
      switch (choice) {
        case '1':
          this.displayRegisteredRooms();
          break;
        case '2':
          this.registerNewRoom();
          break;
        case '3':
          console.log('Goodbye!');
          this.showMainMenu();
          break;
        default:
          console.log('Invalid choice!');
          this.displayAdminMenu();
      }
    });
  }

  private showBookSeatMenu(): void {
    console.log('Choose a room type:');
    console.log(`1. ${RoomType.RESTAURANT}`);
    console.log(`2. ${RoomType.FILM}`);
    console.log(`3. ${RoomType.AIRPLANE}`);
    console.log(`4. ${RoomType.CONFERENCE}`);

    this.rl.question('Enter choice: ', async (choice: string) => {
      let roomType = RoomType.AIRPLANE;
      switch (choice) {
        case '1':
          roomType = RoomType.RESTAURANT;
          break;
        case '2':
          roomType = RoomType.FILM;
          break;
        case '3':
          roomType = RoomType.AIRPLANE;
          break;
        case '4':
          roomType = RoomType.CONFERENCE;
          break;
        default:
          console.log('Invalid choice!');
          this.showBookSeatMenu();
          return;
      }

      console.log(`Please select a room of type ${roomType}:`);
      const rooms = await this.roomRepository.find({
        where: {
          roomType: roomType,
        },
      });
      if (rooms.length == 0) {
        console.log(`\n\nNo rooms of type ${roomType}!\n\n`);
        this.displayCustomerMenu();
      }
      for (let i = 0; i < rooms.length; i++) {
        const displayString = `${rooms[i].name} - $${rooms[i].standardPrice} per seat (${rooms[i].availableSeats} seats available)`;
        console.log(`${i + 1}. ${displayString}`);
      }

      this.rl.question('Enter the choice of room: ', (itemNumber) => {
        const chosenRoom = rooms[Number(itemNumber) - 1];
        if (!chosenRoom) {
          console.log('Invalid room number. Please try again.');
          this.displayCustomerMenu();
        } else {
          this.rl.question(
            'Enter the number of seats you want to book: ',
            async (quantity) => {
              const totalPrice = chosenRoom.standardPrice * Number(quantity);
              console.log(`Total price: $${totalPrice}`);
              const booking = new Booking();
              booking.customerId = this.currentUser.id;
              booking.roomId = chosenRoom.id;
              booking.seatCount = +quantity;
              booking.bookingAmount = totalPrice;
              await this.bookingRepository.save(booking);
              console.log('\n\nYour seats have been booked!');
              await this.roomRepository.update(chosenRoom.id, {
                availableSeats: chosenRoom.availableSeats - +quantity,
              });
              this.displayCustomerMenu();
            },
          );
        }
      });
    });
  }

  private registerNewRoom(): void {
    console.log('\nRegister a New Room:');
    this.rl.question('Please enter the name of the room: ', (name: string) => {
      this.rl.question(
        'Please enter the dimensions of the room (in meters): ',
        (dimensions: string) => {
          this.rl.question(
            'Please enter the seat row length of the room: ',
            (rowLength: string) => {
              this.rl.question(
                'Please enter the standard price of the room: ',
                (standardPrice: string) => {
                  console.log('Please choose a type of room:');
                  console.log('1. Restaurant');
                  console.log('2. Film');
                  console.log('3. Airplane');
                  console.log('4. Conference');
                  this.rl.question(
                    'Please enter your choice: ',
                    async (choice: string) => {
                      let roomType = RoomType.AIRPLANE;
                      switch (choice) {
                        case '1':
                          roomType = RoomType.AIRPLANE;
                          break;
                        case '2':
                          roomType = RoomType.FILM;
                          break;
                        case '3':
                          roomType = RoomType.AIRPLANE;
                          break;
                        case '4':
                          roomType = RoomType.CONFERENCE;
                          break;
                        default:
                          console.log('Invalid choice!');
                          this.registerNewRoom();
                          return;
                      }
                      const room = new Room();
                      room.name = name;
                      room.dimension = dimensions;
                      room.roomType = roomType;
                      room.rowLength = +rowLength;
                      room.standardPrice = +standardPrice;
                      room.userId = this.currentUser.id;
                      room.availableSeats = +rowLength * +rowLength;
                      await this.roomRepository.save(room);
                      console.log(`Room "${name}" registered successfully!`);
                      this.displayAdminMenu();
                    },
                  );
                },
              );
            },
          );
        },
      );
    });
  }

  // Define a function to display registered rooms
  private async displayRegisteredRooms(): Promise<void> {
    const rooms = await this.roomRepository.find({
      where: {
        userId: this.currentUser.id,
      },
    });
    console.log('\nRegistered Rooms:');
    if (rooms.length === 0) {
      console.log('No rooms have been registered yet.');
    } else {
      console.log(
        'ID\tName\t\t\t\tType\t\tDimensions\t\tRow Length\t\tStandard Price',
      );
      console.log(
        '-----------------------------------------------------------------------------------------------------------',
      );
      rooms.forEach((room, index) => {
        console.log(
          `${index + 1}\t${room.name.padEnd(24)}\t${room.roomType.padEnd(
            16,
          )}\t${room.dimension.padEnd(12)}\t${room.rowLength
            .toFixed(2)
            .toString()
            .padEnd(10)}\t${room.standardPrice}`,
        );
      });
    }
    this.displayAdminMenu();
  }

  // Define a function to display bookings information in a formatted way
  private async displayBookings() {
    console.log('Bookings:');
    console.log('Room Name    | Booking ID | Total Price | Number of Seats');
    console.log('--------------------------------------------------------');
    const bookings = await this.bookingRepository.find({
      where: {
        customerId: this.currentUser.id,
      },
    });

    for (const booking of bookings) {
      const room = await this.roomRepository.findOneOrFail({
        where: { id: booking.roomId },
      });
      console.log(
        `${room.name.padEnd(13)}| ${`${booking.id}`.padEnd(
          11,
        )}| $${booking.bookingAmount.toString().padEnd(11)}| ${
          booking.seatCount
        }`,
      );
    }

    console.log('--------------------------------------------------------');
    this.rl.question('Press any key to return to the main menu. ', () => {
      this.displayCustomerMenu();
    });
  }
}
