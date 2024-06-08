package com.ensaj.web.rest;

import com.ensaj.domain.*;
import com.ensaj.repository.*;
import com.ensaj.service.UserService;
import com.ensaj.service.dto.PatientUserDTO;
import com.ensaj.service.dto.RendezVousDTO;
import com.ensaj.service.dto.TransformedDermatologueUserDTO;
import com.ensaj.web.rest.errors.BadRequestAlertException;
import com.ensaj.web.rest.vm.ManagedUserVM;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.ensaj.domain.RendezVous}.
 */
@RestController
@RequestMapping("/api/rendez-vous")
public class RendezVousResource {

    private final Logger log = LoggerFactory.getLogger(RendezVousResource.class);

    private static final String ENTITY_NAME = "rendezVous";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RendezVousRepository rendezVousRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final ConsultationRepository consultationRepository;
    private final DermatologueRepository dermatologueRepository;
    private final SecretaireRepository secretaireRepository;
    private final MaladieRepository maladieRepository;

    public RendezVousResource(
        RendezVousRepository rendezVousRepository,
        UserRepository userRepository,
        UserService userService,
        ConsultationRepository consultationRepository,
        DermatologueRepository dermatologueRepository,
        SecretaireRepository secretaireRepository,
        MaladieRepository maladieRepository
    ) {
        this.rendezVousRepository = rendezVousRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.consultationRepository = consultationRepository;
        this.dermatologueRepository = dermatologueRepository;
        this.secretaireRepository = secretaireRepository;
        this.maladieRepository = maladieRepository;
    }

    /**
     * {@code POST  /rendez-vous} : Create a new rendezVous.
     *
     * @param rendezVous the rendezVous to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new rendezVous, or with status {@code 400 (Bad Request)} if the rendezVous has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<RendezVous> createRendezVous(@RequestBody RendezVous rendezVous) throws URISyntaxException {
        log.debug("REST request to save RendezVous : {}", rendezVous);
        if (rendezVous.getId() != null) {
            throw new BadRequestAlertException("A new rendezVous cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RendezVous result = rendezVousRepository.save(rendezVous);
        // Create a corresponding Consultation
        //        Consultation consultation = new Consultation();
        //        consultation.setDateConsultation(rendezVous.getDateDebut()); // Set the date of the consultation as the current time
        //        consultation.setRendezVous(result);
        //        Consultation savedConsultation = consultationRepository.save(consultation);
        return ResponseEntity
            .created(new URI("/api/rendez-vous/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /rendez-vous/:id} : Updates an existing rendezVous.
     *
     * @param id the id of the rendezVous to save.
     * @param rendezVous the rendezVous to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rendezVous,
     * or with status {@code 400 (Bad Request)} if the rendezVous is not valid,
     * or with status {@code 500 (Internal Server Error)} if the rendezVous couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<RendezVous> updateRendezVous(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody RendezVous rendezVous
    ) throws URISyntaxException {
        log.debug("REST request to update RendezVous : {}, {}", id, rendezVous);
        if (rendezVous.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rendezVous.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rendezVousRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RendezVous result = rendezVousRepository.save(rendezVous);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rendezVous.getId()))
            .body(result);
    }

    @PutMapping("/{id}/change-status")
    public ResponseEntity<RendezVous> changeRendezVousStatus(@PathVariable String id) throws URISyntaxException {
        log.debug("REST request to change RendezVous status: {}", id);

        Optional<RendezVous> existingRendezVous = rendezVousRepository.findById(id);

        return existingRendezVous
            .map(rendezVous -> {
                // Set statut to true regardless of any parameter
                rendezVous.setStatut(true);

                RendezVous result = rendezVousRepository.save(rendezVous);
                Consultation consultation = new Consultation();
                consultation.setDateConsultation(rendezVous.getDateDebut()); // Set the date of the consultation as the current time
                consultation.setRendezVous(result);
                Consultation savedConsultation = consultationRepository.save(consultation);
                return ResponseEntity
                    .ok()
                    .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rendezVous.getId()))
                    .body(result);
            })
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
    }

    /**
     * {@code PATCH  /rendez-vous/:id} : Partial updates given fields of an existing rendezVous, field will ignore if it is null
     *
     * @param id the id of the rendezVous to save.
     * @param rendezVous the rendezVous to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rendezVous,
     * or with status {@code 400 (Bad Request)} if the rendezVous is not valid,
     * or with status {@code 404 (Not Found)} if the rendezVous is not found,
     * or with status {@code 500 (Internal Server Error)} if the rendezVous couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RendezVous> partialUpdateRendezVous(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody RendezVous rendezVous
    ) throws URISyntaxException {
        log.debug("REST request to partial update RendezVous partially : {}, {}", id, rendezVous);
        if (rendezVous.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rendezVous.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rendezVousRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RendezVous> result = rendezVousRepository
            .findById(rendezVous.getId())
            .map(existingRendezVous -> {
                if (rendezVous.getDateDebut() != null) {
                    existingRendezVous.setDateDebut(rendezVous.getDateDebut());
                }
                if (rendezVous.getDateFin() != null) {
                    existingRendezVous.setDateFin(rendezVous.getDateFin());
                }
                if (rendezVous.getStatut() != null) {
                    existingRendezVous.setStatut(rendezVous.getStatut());
                }

                return existingRendezVous;
            })
            .map(rendezVousRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rendezVous.getId())
        );
    }

    /**
     * {@code GET  /rendez-vous} : get all the rendezVous.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of rendezVous in body.
     */
    // @GetMapping("")
    // public List<RendezVous> getAllRendezVous() {
    //     log.debug("REST request to get all RendezVous");
    //     List<RendezVous> mylist=rendezVousRepository.findAll();
    //     return mylist;
    // }
    @GetMapping("")
    public List<RendezVousDTO> getAllRendezVous() {
        log.debug("REST request to get all RendezVous");
        List<RendezVous> rendezvousList = rendezVousRepository.findAll();

        List<RendezVousDTO> rendezvousDTOList = rendezvousList
            .stream()
            .map(rendezvous -> {
                RendezVousDTO rendezvousDTO = new RendezVousDTO();
                rendezvousDTO.setId(rendezvous.getId());
                rendezvousDTO.setDateDebut(rendezvous.getDateDebut());
                rendezvousDTO.setDateFin(rendezvous.getDateFin());
                rendezvousDTO.setStatut(rendezvous.getStatut());
                TransformedDermatologueUserDTO transformedDermatologueUserDTO = userService.findUserDermatologue(
                    rendezvous.getDermatologues().getId()
                );

                // Add the dermatologist's user to the RendezVousDTO
                if (rendezvous.getDermatologues() != null) {
                    rendezvousDTO.setDermatologue(transformedDermatologueUserDTO);
                } else {
                    // Handle the case where the dermatologist is null or does not have a user
                    // You can set it to null or handle it in some other way based on your requirements.
                    rendezvousDTO.setDermatologue(null);
                }

                // Add the patient's user to the RendezVousDTO
                rendezvousDTO.setPatient(rendezvous.getPatients());

                return rendezvousDTO;
            })
            .collect(Collectors.toList());

        return rendezvousDTOList;
    }

    @GetMapping("rdvs")
    public List<RendezVousDTO> getAllRendezVousNew() {
        log.debug("REST request to get all RendezVous");
        List<RendezVous> rendezvousList = rendezVousRepository.findAll();

        return rendezvousList.stream().map(rendezvous -> mapRendezVousToDTO(rendezvous)).collect(Collectors.toList());
    }

    //get patient all Rendez-vous(appointements)
    @GetMapping("patient/rdvs/{id}")
    public List<RendezVousDTO> getAllRendezVousForaPatient(@PathVariable String id) {
        log.debug("REST request to get all RendezVous");
        List<RendezVous> rendezvousList = rendezVousRepository.findAll();
        //debut
        List<RendezVous> data = new ArrayList<>();
        for (RendezVous r : rendezvousList) {
            if (r.getPatients().getUser().getId().equals(id)) {
                data.add(r);
            }
        }

        //fin
        return data.stream().map(rendezvous -> mapRendezVousToDTO(rendezvous)).collect(Collectors.toList());
    }

    private RendezVousDTO mapRendezVousToDTO(RendezVous rendezvous) {
        RendezVousDTO rendezvousDTO = new RendezVousDTO();
        rendezvousDTO.setId(rendezvous.getId());
        rendezvousDTO.setDateDebut(rendezvous.getDateDebut());
        rendezvousDTO.setDateFin(rendezvous.getDateFin());
        rendezvousDTO.setStatut(rendezvous.getStatut());

        // Add the dermatologist's user to the RendezVousDTO
        String dermatologueId = rendezvous.getDermatologues().getId();
        TransformedDermatologueUserDTO transformedDermatologueUserDTO = userService.findUserDermatologue(dermatologueId);
        rendezvousDTO.setDermatologue(transformedDermatologueUserDTO);

        // Add the patient's user to the RendezVousDTO
        rendezvousDTO.setPatient(rendezvous.getPatients());

        return rendezvousDTO;
    }

    //  @GetMapping("")
    // public List<RendezVousDTO> getAllRendezVous() {
    //     log.debug("REST request to get all RendezVous");
    //     List<RendezVous> rendezvousList = rendezVousRepository.findAll();

    //     List<RendezVousDTO> rendezvousDTOList = rendezvousList.stream()
    //             .map(rendezvous -> {
    //                 RendezVousDTO rendezvousDTO = new RendezVousDTO();
    //                 rendezvousDTO.setId(rendezvous.getId());
    //                 rendezvousDTO.setDateDebut(rendezvous.getDateDebut());
    //                 rendezvousDTO.setDateFin(rendezvous.getDateFin());
    //                 // rendezvousDTO.setStatut(rendezvous.getStatut());

    //                 // Add the dermatologist's user to the RendezVousDTO
    //                 if (rendezvous.getDermatologues() != null) {
    //                     rendezvousDTO.setDermatologue(rendezvous.getDermatologues());
    //                 } else {
    //                     // Handle the case where the dermatologist is null or does not have a user
    //                     // You can set it to null or handle it in some other way based on your requirements.
    //                     rendezvousDTO.setDermatologue(null);
    //                 }

    //                 // Add the patient's user to the RendezVousDTO
    //                 rendezvousDTO.setPatient(rendezvous.getPatients());

    //                 return rendezvousDTO;
    //             })
    //             .collect(Collectors.toList());

    //     return rendezvousDTOList;
    // }

    //     @GetMapping("")
    // public List<RendezVous> getAllRendezVous() {
    //     log.debug("REST request to get all RendezVous");

    //     List<RendezVous> rendezVousList = rendezVousRepository.findAll();
    //     List<RendezVous> rendezVousDTOList = new ArrayList<>();

    //     for (RendezVous rendezVous : rendezVousList) {
    //         Dermatologue dermatologue = rendezVous.getDermatologues();
    //         Patient patient = rendezVous.getPatients();

    //         if (dermatologue != null) {
    //             log.debug("Processing RendezVous with Dermatologue");

    //             Optional<User> u = userRepository.findById(dermatologue.getId());
    //             User dermatologueUser = u.orElse(null);

    //             if (dermatologueUser != null) {
    //                 log.debug("Dermatologue User found, ID: " + dermatologueUser.getId());
    //                 dermatologue.setUser(dermatologueUser);
    //             } else {
    //                 log.debug("Dermatologue User not found for ID: " + dermatologue.getId());
    //             }
    //         } else {
    //             log.debug("RendezVous has no associated Dermatologue");
    //         }

    //         if (patient != null) {
    //             log.debug("Processing RendezVous with Patient");

    //         }
    //         // Add the processed RendezVous to the list
    //         rendezVousDTOList.add(rendezVous);
    //     }

    //     return rendezVousDTOList;
    // }

    //     @GetMapping("")
    //     public List<RendezVous> getAllRendezVous() {
    //         log.debug("REST request to get all RendezVous");

    //         List<RendezVous> rendezVousList = rendezVousRepository.findAll();

    //         for (RendezVous rendezVous : rendezVousList) {

    //             Dermatologue dermatologue = rendezVous.getDermatologues();
    //             Patient patient = rendezVous.getPatients();
    //             if (dermatologue != null) {
    //                 Optional<User> u = userRepository.findById(dermatologue.getId());
    //                 if (u.isPresent()) {
    //                     dermatologue.setUser(u.get());

    //                 }

    //             }
    //             rendezVous.setDermatologues(dermatologue);
    //             if (patient != null) {
    //                 Optional<User> u = userRepository.findById(patient.getId());
    //                 if (u.isPresent()) {
    //                     patient.setUser(u.get());

    //                 }
    //                 rendezVous.setPatients(patient);
    //             }
    //         }

    //     return rendezVousList;
    // }

    // @GetMapping("")
    // public List<RendezVous> getAllRendezVous() {
    //     log.debug("REST request to get all RendezVous");
    //     List<RendezVous> AllrendezVous = rendezVousRepository.findAll();
    //     List<RendezVous> rendezVousDTOList = new ArrayList<>();
    //     for (RendezVous rendezVous : AllrendezVous) {
    //         RendezVous rendezVousDTO = new RendezVous();
    //         rendezVousDTO.setId(rendezVous.getId());
    //         rendezVousDTO.setDateDebut(rendezVous.getDateDebut());
    //         rendezVousDTO.setDateFin(rendezVous.getDateFin());
    //         // rendezVousDTO.setStatut(rendezVous.isStatut());

    //         // Add the dermatologue user information
    //         Dermatologue dermatologue = rendezVous.getDermatologues();
    //         Optional<User> user = userRepository.findById(dermatologue.getId());
    //         if (user.isPresent()) {
    //             User userVM = new User();
    //             userVM.setId(user.get().getId());
    //             userVM.setFirstName(user.get().getFirstName());
    //             userVM.setLastName(user.get().getLastName());
    //             userVM.setEmail(user.get().getEmail());
    //             dermatologue.setUser(userVM);
    //         }
    //         rendezVousDTO.setDermatologues(dermatologue);

    //         // Add the patient user information
    //         Patient patient = rendezVous.getPatients();
    //         Optional<User> user2 = userRepository.findById(patient.getId());
    //         if (user.isPresent()) {
    //             User userVM = new User();
    //             userVM.setId(user.get().getId());
    //             userVM.setFirstName(user.get().getFirstName());
    //             userVM.setLastName(user.get().getLastName());
    //             userVM.setEmail(user.get().getEmail());
    //             patient.setUser(userVM);
    //         }
    //         rendezVousDTO.setPatients(patient);

    //         rendezVousDTOList.add(rendezVousDTO);
    //     }

    //     return rendezVousDTOList;
    // }

    /**
     * {@code GET  /rendez-vous/:id} : get the "id" rendezVous.
     *
     * @param id the id of the rendezVous to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the rendezVous, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<RendezVous> getRendezVous(@PathVariable String id) {
        log.debug("REST request to get RendezVous : {}", id);
        Optional<RendezVous> rendezVous = rendezVousRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(rendezVous);
    }

    /**
     * {@code DELETE  /rendez-vous/:id} : delete the "id" rendezVous.
     *
     * @param id the id of the rendezVous to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRendezVous(@PathVariable String id) {
        log.debug("REST request to delete RendezVous : {}", id);
        List<Consultation> consultations = consultationRepository.findAll();

        try {
            for (Consultation consultation : consultations) {
                if (consultation.getRendezVous() != null && consultation.getRendezVous().getId().equals(id)) {
                    consultationRepository.deleteById(consultation.getId());
                }
            }
            rendezVousRepository.deleteById(id);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }

    @GetMapping("/dermatologue/{id}")
    public List<RendezVous> getAllAppointement(@PathVariable String id) {
        List<RendezVous> rdv = rendezVousRepository.findAll();
        List<RendezVous> data = new ArrayList<>();
        for (RendezVous r : rdv) {
            if (r.getDermatologues().getId().equals(id)) {
                Patient p = r.getPatients();

                Optional<User> user = userRepository.findById(p.getUser().getId());
                if (user.isPresent()) {
                    PatientUserDTO patientUserDTO = new PatientUserDTO();
                    ManagedUserVM managedUserVM = new ManagedUserVM();
                    managedUserVM.setEmail(user.get().getEmail());
                    managedUserVM.setFirstName(user.get().getFirstName());
                    managedUserVM.setLastName(user.get().getLastName());

                    //                    p.setUser(user.get());
                    patientUserDTO.setPatient(p);
                    r.setPatientUserDTO(patientUserDTO);
                    data.add(r);
                }
            }
        }
        return data;
    }

    @GetMapping("confirmed/dermatologue/{id}")
    public List<RendezVous> getAllAppointementConfirmed(@PathVariable String id) {
        List<RendezVous> rdv = rendezVousRepository.findAll();
        List<RendezVous> data = new ArrayList<>();
        for (RendezVous r : rdv) {
            if (r.getDermatologues().getId().equals(id) && r.getStatut() == true) {
                Patient p = r.getPatients();

                Optional<User> user = userRepository.findById(p.getUser().getId());
                if (user.isPresent()) {
                    PatientUserDTO patientUserDTO = new PatientUserDTO();
                    ManagedUserVM managedUserVM = new ManagedUserVM();
                    managedUserVM.setEmail(user.get().getEmail());
                    managedUserVM.setFirstName(user.get().getFirstName());
                    managedUserVM.setLastName(user.get().getLastName());

                    //                    p.setUser(user.get());
                    patientUserDTO.setPatient(p);
                    r.setPatientUserDTO(patientUserDTO);
                    data.add(r);
                }
            }
        }
        return data;
    }

    @GetMapping("/statistics")
    public List<Long> statisticsForMonth() {
        Long nDermatologues = dermatologueRepository.count();
        Long nSecretaire = secretaireRepository.count();
        Long nMaladies = maladieRepository.count();
        Long nConsultation = consultationRepository.count();

        List<Long> liste = new ArrayList<>();
        liste.add(nDermatologues);
        liste.add(nSecretaire);
        liste.add(nMaladies);
        liste.add(nConsultation);

        return liste;
    }

    @GetMapping("/jours-du-mois")
    public Map<String, Long> getJoursDuMois() {
        List<String> joursDuMois = new ArrayList<>();
        LocalDate dateActuelle = LocalDate.now();
        int nombreDeJoursDansLeMois = dateActuelle.lengthOfMonth();
        for (int jour = 1; jour <= nombreDeJoursDansLeMois; jour++) {
            joursDuMois.add(dateActuelle.withDayOfMonth(jour).toString());
        }
        List<Consultation> consultations = consultationRepository.findAll();

        Map<String, Long> dataJson = new HashMap<>();

        joursDuMois.forEach(e -> {
            long count = consultations
                .stream()
                .filter(c -> e.equals(c.getDateConsultation().atZone(ZoneId.systemDefault()).toLocalDate().toString()))
                .count();
            dataJson.put(e, count);
        });

        return dataJson;
    }

    @GetMapping("/statistique-data/{login}")
    public List<Long> getData(@PathVariable String login) {
        Optional<User> user = userRepository.findOneByLogin(login);
        if (user.isPresent()) {
            Optional<Dermatologue> dermatologue = dermatologueRepository.findById(user.get().getId());
            Instant debutAujourdhui = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant();
            Instant debutDemain = LocalDate.now().plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
            if (dermatologue.isPresent()) {
                List<Long> listData = new ArrayList<>();
                List<RendezVous> liste = rendezVousRepository.findTodayTrueStatusByDermatologues(
                    dermatologue.get().getId(),
                    debutAujourdhui,
                    debutDemain
                );
                listData.add(Long.valueOf(liste.size()));

                List<RendezVous> rendezVousList = rendezVousRepository.findDistinctPatientsByDermatologueId(dermatologue.get().getId());
                Set<String> patientIds = new HashSet<>();
                for (RendezVous rendezVous : rendezVousList) {
                    patientIds.add(rendezVous.getPatients().getId());
                }
                int nombrePatient = patientIds.size();
                listData.add(Long.valueOf(nombrePatient));
                return listData;
            }
        }
        //
        return null;
    }

    @GetMapping("/about-dermatologues")
    public Map<String, Long> aboutDermatologues() {
        Map<String, Long> data = new HashMap<>();
        List<Dermatologue> dermatologues = dermatologueRepository.findAll();

        for (Dermatologue d : dermatologues) {
            Optional<User> user = userRepository.findById(d.getId());

            Instant debutAujourdhui = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant();
            Instant debutDemain = LocalDate.now().plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

            List<RendezVous> liste = rendezVousRepository.findTodayTrueStatusByDermatologues(d.getId(), debutAujourdhui, debutDemain);
            data.put(user.get().getFirstName() + " " + user.get().getLastName(), Long.valueOf(liste.size()));
        }
        return data;
    }
}
