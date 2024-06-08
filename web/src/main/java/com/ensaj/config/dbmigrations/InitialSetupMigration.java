package com.ensaj.config.dbmigrations;

import com.ensaj.config.Constants;
import com.ensaj.domain.*;
import com.ensaj.repository.*;
import com.ensaj.security.AuthoritiesConstants;
import com.ensaj.service.UserService;
import com.ensaj.service.dto.DermatologueUserDTO;
import com.ensaj.service.dto.PatientUserDTO;
import com.ensaj.service.dto.SecretaireUserDTO;
import com.ensaj.web.rest.vm.ManagedUserVM;
import io.mongock.api.annotations.ChangeUnit;
import io.mongock.api.annotations.Execution;
import io.mongock.api.annotations.RollbackExecution;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Creates the initial database setup.
 */
@ChangeUnit(id = "users-initialization", order = "001")
public class InitialSetupMigration {

    private final MongoTemplate template;
    private UserRepository userRepository;
    private UserService userService;
    private DermatologueRepository dermatologueRepository;
    private SecretaireRepository secretaireRepository;
    private PatientRepository patientRepository;
    private MaladieRepository maladieRepository;

    public InitialSetupMigration(
        MongoTemplate template,
        UserRepository userRepository,
        UserService userService,
        DermatologueRepository dermatologueRepository,
        SecretaireRepository secretaireRepository,
        PatientRepository patientRepository,
        MaladieRepository maladieRepository
    ) {
        this.template = template;
        this.userRepository = userRepository;
        this.userService = userService;
        this.dermatologueRepository = dermatologueRepository;
        this.secretaireRepository = secretaireRepository;
        this.patientRepository = patientRepository;
        this.maladieRepository = maladieRepository;
    }

    @Execution
    public void changeSet(PasswordEncoder passwordEncoder) {
        Authority userAuthority = createUserAuthority();
        userAuthority = template.save(userAuthority);

        Authority dermatologueAuthority = createDermatologueAuthority();
        dermatologueAuthority = template.save(dermatologueAuthority);

        Authority secretaireAuthority = createsercetaireAuthority();
        secretaireAuthority = template.save(secretaireAuthority);

        Authority patientAuthority = createPatientAuthority();
        patientAuthority = template.save(patientAuthority);

        Authority adminAuthority = createAdminAuthority();
        adminAuthority = template.save(adminAuthority);

        addUsers(userAuthority, adminAuthority, dermatologueAuthority, secretaireAuthority, patientAuthority, passwordEncoder);
        createMaladies(maladieRepository);
    }

    @RollbackExecution
    public void rollback() {}

    private Authority createAuthority(String authority) {
        Authority adminAuthority = new Authority();
        adminAuthority.setName(authority);
        return adminAuthority;
    }

    private Authority createAdminAuthority() {
        Authority adminAuthority = createAuthority(AuthoritiesConstants.ADMIN);
        return adminAuthority;
    }

    private Authority createUserAuthority() {
        Authority userAuthority = createAuthority(AuthoritiesConstants.USER);
        return userAuthority;
    }

    private Authority createDermatologueAuthority() {
        Authority dermatologueAuthority = createAuthority(AuthoritiesConstants.DERMATOLOGUE);
        return dermatologueAuthority;
    }

    private Authority createsercetaireAuthority() {
        Authority secretaireAuthority = createAuthority(AuthoritiesConstants.SECRETAIRE);
        return secretaireAuthority;
    }

    private Authority createPatientAuthority() {
        Authority patientAuthority = createAuthority(AuthoritiesConstants.PATIENT);
        return patientAuthority;
    }

    private void addUsers(
        Authority userAuthority,
        Authority adminAuthority,
        Authority dermatologueAuthority,
        Authority secretaireAuthority,
        Authority patientAuthority,
        PasswordEncoder passwordEncoder
    ) {
        User user = createUser(userAuthority);
        template.save(user);
        User admin = createAdmin(adminAuthority);
        template.save(admin);

        List<DermatologueUserDTO> d = createDermatologue(passwordEncoder, dermatologueAuthority);

        SecretaireUserDTO s = createSecretaire(passwordEncoder, secretaireAuthority);

        List<PatientUserDTO> p = createPatient(passwordEncoder, patientAuthority);
    }

    private User createUser(Authority userAuthority) {
        User userUser = new User();
        userUser.setId("user-2");
        userUser.setLogin("user");
        userUser.setPassword("$2a$10$VEjxo0jq2YG9Rbk2HmX9S.k1uZBGYUHdUcid3g/vfiEl7lwWgOH/K");
        userUser.setFirstName("User");
        userUser.setLastName("User");
        userUser.setEmail("user@localhost");
        userUser.setActivated(true);
        userUser.setLangKey("en");
        userUser.setCreatedBy(Constants.SYSTEM);
        userUser.setCreatedDate(Instant.now());
        userUser.getAuthorities().add(userAuthority);
        return userUser;
    }

    private User createAdmin(Authority adminAuthority) {
        User adminUser = new User();
        adminUser.setId("user-1");
        adminUser.setLogin("admin");
        adminUser.setPassword("$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC");
        adminUser.setFirstName("admin");
        adminUser.setLastName("Administrator");
        adminUser.setEmail("admin@localhost");
        adminUser.setActivated(true);
        adminUser.setLangKey("en");
        adminUser.setCreatedBy(Constants.SYSTEM);
        adminUser.setCreatedDate(Instant.now());
        adminUser.getAuthorities().add(adminAuthority);
        return adminUser;
    }


    private List<DermatologueUserDTO> createDermatologue(PasswordEncoder passwordEncoder, Authority dermatologueAuthority) {
        List<DermatologueData> dermatologueDataList = new ArrayList<>();

        dermatologueDataList.add(
            new DermatologueData("male", "0612345678", "K768425", "lachgar", "password", "Mohammed", "Lachgar", "lachgar@gmail.com")
        );
        dermatologueDataList.add(
            new DermatologueData("male", "0610111250", "Z324425", "elbahja", "password", "Charafeddine", "ELBAHJA", "charaf@gmail.com")
        );
        dermatologueDataList.add(
            new DermatologueData("male", "0610551460", "C144221", "elmansouri", "password", "Amine", "ELMANSOURI", "amine@gmail.com")
        );

        dermatologueDataList.add(
            new DermatologueData("male", "0634567289", "L192882", "hassini", "password", "Yassine", "Hassini", "yassine@gmail.com")
        );

        List<DermatologueUserDTO> dermatologueList = new ArrayList<>();

        for (DermatologueData dermatologueData : dermatologueDataList) {
            DermatologueUserDTO dermatologue = new DermatologueUserDTO();
            dermatologue.setDermatologue(new Dermatologue());
            dermatologue.setUser(new ManagedUserVM());

            Dermatologue dermatologue1 = dermatologue.getDermatologue();
            dermatologue1.setGenre(dermatologueData.getGenre());
            dermatologue1.setTelephone(dermatologueData.getTelephone());
            dermatologue1.setCodeEmp(dermatologueData.getCodeEmp());

            ManagedUserVM user = dermatologue.getUser();
            User user1 = new User();
            user1.setLogin(dermatologueData.getLogin());
            user1.setPassword(passwordEncoder.encode(dermatologueData.getPassword()));
            user1.setFirstName(dermatologueData.getFirstName());
            user1.setLastName(dermatologueData.getLastName());
            user1.setEmail(dermatologueData.getEmail());
            user1.setActivated(true);
            user1.setAuthorities(new HashSet<>());
            user1.getAuthorities().add(dermatologueAuthority);

            userRepository.save(user1);

            Optional<User> lastOne = userRepository.findOneByLogin(dermatologueData.getLogin());
            if (lastOne.isPresent()) {
                dermatologue1.setId(lastOne.get().getId());
                Dermatologue result = dermatologueRepository.save(dermatologue1);
                dermatologueList.add(dermatologue);
            }
        }

        return dermatologueList;
    }

    private SecretaireUserDTO createSecretaire(PasswordEncoder passwordEncoder, Authority sercetaireAuthority) {
        SecretaireUserDTO secretaireUserDTO = new SecretaireUserDTO();
        secretaireUserDTO.setSecretaire(new Secretaire());
        secretaireUserDTO.setUser(new ManagedUserVM());

        Secretaire secretaire = secretaireUserDTO.getSecretaire();
        secretaire.setGenre("female");
        secretaire.setTelephone("0645321455");
        secretaire.setCodeEmp("K890000");

        User user = new User();
        user.setLogin("amina");
        user.setEmail("amina@gmail.com");
        user.setPassword(passwordEncoder.encode("password"));
        user.setLastName("Aboulmira");
        user.setFirstName("Amina");
        user.setActivated(true);
        user.setAuthorities(new HashSet<>());
        user.getAuthorities().add(sercetaireAuthority);
        userRepository.save(user);

        Optional<User> user1 = userRepository.findOneByLogin("amina");
        if (user1.isPresent()) {
            secretaire.setId(user1.get().getId());
            Secretaire result = secretaireRepository.save(secretaire);
        }

        return null;
    }


    private List<PatientUserDTO> createPatient(PasswordEncoder passwordEncoder, Authority patientAuthority) {
        List<PatientData> patientDataList = new ArrayList<>();

        patientDataList.add(
            new PatientData(
                Instant.now(),
                "Casablanca",
                "male",
                "0678904523",
                "Khalid@gmail.com",
                "khalid",
                "password",
                "Khalid",
                "Elmohammadi"
            )
        );
        patientDataList.add(
            new PatientData(
                Instant.now(),
                "Casablanca",
                "male",
                "0671233456",
                "mohamed@gmail.com",
                "mohamed",
                "password",
                "MOHAMED",
                "ABOU ELKHIR"
            )
        );
        patientDataList.add(
            new PatientData(Instant.now(), "Agadir", "male", "0689234445", "saad@gmail.com", "saad", "password", "SAAD", "BAKANZIZE")
        );
        patientDataList.add(
            new PatientData(
                Instant.now(),
                "Agadir",
                "female",
                "0611234567",
                "kaoutar@gmail.com",
                "kaoutar",
                "password",
                "KAOUTAR",
                "ED-DAIF"
            )
        );
        patientDataList.add(
            new PatientData(Instant.now(), "Agadir", "female", "0690786535", "aya@gmail.com", "aya", "password", "AYA", "EL AMARI")
        );
        patientDataList.add(
            new PatientData(Instant.now(), "Casablanca", "male", "0679233459", "ezzahi@gmail.com", "hamza", "password", "HAMZA", "EZZAHI")
        );
        patientDataList.add(
            new PatientData(Instant.now(), "Casablanca", "male", "0674433056", "ziz@gmail.com", "ilyas", "password", "ILYAS", "ZIZ")
        );
        patientDataList.add(
            new PatientData(
                Instant.now(),
                "Casablanca",
                "male",
                "0683723567",
                "youssef@gmail.com",
                "youssef",
                "password",
                "YOUSSEF",
                "KADIRI"
            )
        );
        patientDataList.add(
            new PatientData(
                Instant.now(),
                "Casablanca",
                "male",
                "0615627890",
                "abdelhafid@gmail.com",
                "abdelhafid",
                "password",
                "ABDELHAFID",
                "NIDEABDELLAH"
            )
        );
        // Add more patient data entries as needed

        List<PatientUserDTO> patientList = new ArrayList<>();

        for (PatientData patientData : patientDataList) {
            PatientUserDTO patientUserDTO = new PatientUserDTO();
            patientUserDTO.setPatient(new Patient());
            patientUserDTO.setUser(new ManagedUserVM());

            Patient patient = patientUserDTO.getPatient();
            patient.setBirthdate(patientData.getBirthdate());
            patient.setAdress(patientData.getAdress());
            patient.setGenre(patientData.getGenre());
            patient.setTelephone(patientData.getTelephone());

            User user = new User();
            user.setEmail(patientData.getEmail());
            user.setLogin(patientData.getLogin());
            user.setPassword(passwordEncoder.encode(patientData.getPassword()));
            user.setActivated(true);
            user.setFirstName(patientData.getFirstName());
            user.setLastName(patientData.getLastName());
            user.setAuthorities(new HashSet<>());
            user.getAuthorities().add(patientAuthority);

            userRepository.save(user);

            Optional<User> user1 = userRepository.findOneByLogin(patientData.getLogin());
            if (user1.isPresent()) {
                patient.setUser(user);
                patient.setId(user1.get().getId());
                Patient result = patientRepository.save(patient);
                System.out.println("Saved patient with success");
                patientList.add(patientUserDTO);
            }
        }

        return patientList;
    }

    private void createMaladies(MaladieRepository maladieRepository) {
        List<String> maladies = new ArrayList<>(
            List.of(
                "Melanocytic nevi",
                "Melanoma",
                "Dermatofibroma",
                "Vascular lesions",
                "Benign keratosis-like lesions",
                "Basal cell carcinoma",
                "Actinic keratoses and Bowen's disease"
            )
        );
        List<String> abbrs = new ArrayList<>(List.of("nv", "mel", "df", "vasc", "bkl", "bcc", "akiec"));
        for (int i = 0; i < maladies.size(); i++) {
            Maladie m = new Maladie();
            m.setFullName(maladies.get(i));
            m.setAbbr(abbrs.get(i));
            maladieRepository.save(m);
        }
    }
}
