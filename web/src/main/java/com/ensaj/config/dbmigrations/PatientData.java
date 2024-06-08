package com.ensaj.config.dbmigrations;

import java.time.Instant;

public class PatientData {

    private Instant birthdate;
    private String adress;
    private String genre;
    private String telephone;
    private String email;
    private String login;
    private String password;
    private String firstName;
    private String lastName;

    // Default constructor
    public PatientData() {}

    // Constructor with parameters
    public PatientData(
        Instant birthdate,
        String adress,
        String genre,
        String telephone,
        String email,
        String login,
        String password,
        String firstName,
        String lastName
    ) {
        this.birthdate = birthdate;
        this.adress = adress;
        this.genre = genre;
        this.telephone = telephone;
        this.email = email;
        this.login = login;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    // Getters and setters
    public Instant getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(Instant birthdate) {
        this.birthdate = birthdate;
    }

    public String getAdress() {
        return adress;
    }

    public void setAdress(String adress) {
        this.adress = adress;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
