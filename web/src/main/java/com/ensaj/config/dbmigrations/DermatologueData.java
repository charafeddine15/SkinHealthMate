package com.ensaj.config.dbmigrations;

public class DermatologueData {

    private String genre;
    private String telephone;
    private String codeEmp;
    private String login;
    private String password;
    private String firstName;
    private String lastName;
    private String email;

    // Default constructor
    public DermatologueData() {}

    // Constructor with parameters
    public DermatologueData(
        String genre,
        String telephone,
        String codeEmp,
        String login,
        String password,
        String firstName,
        String lastName,
        String email
    ) {
        this.genre = genre;
        this.telephone = telephone;
        this.codeEmp = codeEmp;
        this.login = login;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    // Getters and setters
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

    public String getCodeEmp() {
        return codeEmp;
    }

    public void setCodeEmp(String codeEmp) {
        this.codeEmp = codeEmp;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
