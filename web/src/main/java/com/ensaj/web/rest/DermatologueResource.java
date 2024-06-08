package com.ensaj.web.rest;

import com.ensaj.domain.*;
import com.ensaj.repository.*;
import com.ensaj.security.AuthoritiesConstants;
import com.ensaj.service.UserService;
import com.ensaj.service.dto.DermatologuePatientsDTO;
import com.ensaj.service.dto.DermatologueUserDTO;
import com.ensaj.service.dto.TransformedDermatologueUserDTO;
import com.ensaj.web.rest.errors.BadRequestAlertException;
import com.ensaj.web.rest.vm.ManagedUserVM;
import java.net.URI;
import java.net.URISyntaxException;
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
 * REST controller for managing {@link com.ensaj.domain.Dermatologue}.
 */
@RestController
@RequestMapping("/api")
public class DermatologueResource {

    private final Logger log = LoggerFactory.getLogger(DermatologueResource.class);

    private static final String ENTITY_NAME = "dermatologue";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DermatologueRepository dermatologueRepository;
    private final RendezVousRepository rendezVousRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final ConsultationRepository consultationRepository;
    private final DiagnosticRepository diagnosticRepository;

    public DermatologueResource(
        DermatologueRepository dermatologueRepository,
        RendezVousRepository rendezVousRepository,
        UserService userService,
        UserRepository userRepository,
        ConsultationRepository consultationRepository,
        DiagnosticRepository diagnosticRepository
    ) {
        this.dermatologueRepository = dermatologueRepository;
        this.rendezVousRepository = rendezVousRepository;
        this.userService = userService;
        this.userRepository = userRepository;
        this.consultationRepository = consultationRepository;
        this.diagnosticRepository = diagnosticRepository;
    }

    /**
     * {@code POST  /dermatologues} : Create a new dermatologue.
     *
     * @param dermatologue the dermatologue to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new dermatologue, or with status {@code 400 (Bad Request)} if the dermatologue has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/dermatologues")
    public ResponseEntity<Dermatologue> createDermatologue(@RequestBody DermatologueUserDTO dermatologue) throws URISyntaxException {
        log.debug("REST request to save Dermatologue : {}", dermatologue);
        Optional<User> existingUser = userRepository.findOneByLogin(dermatologue.getUser().getLogin());

        if (existingUser.isPresent()) {
            return null;
        }
        if (dermatologue.getDermatologue().getId() != null) {
            throw new BadRequestAlertException("A new dermatologue cannot already have an ID", ENTITY_NAME, "idexists");
        }

        Dermatologue dermatologue1 = dermatologue.getDermatologue();
        ManagedUserVM user = dermatologue.getUser();
        user.setAuthorities(new HashSet<>());
        user.getAuthorities().add(AuthoritiesConstants.DERMATOLOGUE);

        User u = userService.createDermatologue(user);
        Optional<User> lastOne = userRepository.findOneByLogin(u.getLogin());
        if (lastOne.isPresent()) {
            dermatologue1.setId(lastOne.get().getId());
            Dermatologue result = dermatologueRepository.save(dermatologue1);
            return ResponseEntity
                .created(new URI("/api/dermatologues/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
                .body(result);
        }
        return null;
    }

    /**
     * {@code PUT  /dermatologues/:id} : Updates an existing dermatologue.
     *
     * @param id the id of the dermatologue to save.
     * @param dermatologue the dermatologue to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dermatologue,
     * or with status {@code 400 (Bad Request)} if the dermatologue is not valid,
     * or with status {@code 500 (Internal Server Error)} if the dermatologue couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    //    @PutMapping("/dermatologues/{id}")
    //    public ResponseEntity<Dermatologue> updateDermatologue(
    //        @PathVariable(value = "id", required = false) final String id,
    //        @RequestBody Dermatologue dermatologue
    //    ) throws URISyntaxException {
    //        log.debug("REST request to update Dermatologue : {}, {}", id, dermatologue);
    //        if (dermatologue.getId() == null) {
    //            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
    //        }
    //        if (!Objects.equals(id, dermatologue.getId())) {
    //            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
    //        }
    //
    //        if (!dermatologueRepository.existsById(id)) {
    //            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
    //        }
    //
    //        Dermatologue result = dermatologueRepository.save(dermatologue);
    //        return ResponseEntity
    //            .ok()
    //            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dermatologue.getId()))
    //            .body(result);
    //    }

    @PutMapping("/dermatologues/{id}")
    public ResponseEntity<Dermatologue> updateDermatologue(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Dermatologue dermatologue
    ) throws URISyntaxException {
        log.debug("REST request to update Dermatologue : {}, {}", id, dermatologue);
        if (dermatologue.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dermatologue.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dermatologueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Dermatologue result = dermatologueRepository.save(dermatologue);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dermatologue.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /dermatologues/:id} : Partial updates given fields of an existing dermatologue, field will ignore if it is null
     *
     * @param id the id of the dermatologue to save.
     * @param dermatologue the dermatologue to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dermatologue,
     * or with status {@code 400 (Bad Request)} if the dermatologue is not valid,
     * or with status {@code 404 (Not Found)} if the dermatologue is not found,
     * or with status {@code 500 (Internal Server Error)} if the dermatologue couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/dermatologues/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Dermatologue> partialUpdateDermatologue(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Dermatologue dermatologue
    ) throws URISyntaxException {
        log.debug("REST request to partial update Dermatologue partially : {}, {}", id, dermatologue);
        if (dermatologue.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dermatologue.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dermatologueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Dermatologue> result = dermatologueRepository
            .findById(dermatologue.getId())
            .map(existingDermatologue -> {
                if (dermatologue.getCodeEmp() != null) {
                    existingDermatologue.setCodeEmp(dermatologue.getCodeEmp());
                }
                if (dermatologue.getGenre() != null) {
                    existingDermatologue.setGenre(dermatologue.getGenre());
                }
                if (dermatologue.getTelephone() != null) {
                    existingDermatologue.setTelephone(dermatologue.getTelephone());
                }

                return existingDermatologue;
            })
            .map(dermatologueRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dermatologue.getId())
        );
    }

    /**
     * {@code GET  /dermatologues} : get all the dermatologues.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of dermatologues in body.
     */
    //    @GetMapping("/dermatologues")
    //    public List<Dermatologue> getAllDermatologues() {
    //        log.debug("REST request to get all Dermatologues");
    //        return dermatologueRepository.findAll();
    //    }

    @GetMapping("/dermatologues")
    public List<Dermatologue> getAllDermatologues() {
        log.debug("REST request to get all Dermatologues");
        //        return dermatologueRepository.findAll();
        List<Dermatologue> liste = dermatologueRepository.findAll();
        for (Dermatologue e : liste) {
            Optional<User> u = userRepository.findById(e.getId());
            if (u.isPresent()) {
                e.setUser(u.get());
            }
        }
        return liste;
    }

    //
    // @GetMapping("/dermatologuePatients/{id}")
    // public ResponseEntity<TransformedDermatologueUserDTO> getDermatologuePatients(@PathVariable String id) {
    //     log.debug("REST request to get Dermatologue : {}", id);
    //     Optional<Dermatologue> dermatologue = dermatologueRepository.findById(id);

    //     if (dermatologue.isPresent()) {
    //         TransformedDermatologueUserDTO transformedDermatologueUserDTO = userService.findUserDermatologue(id);

    //         // Fetch and set the patients for the dermatologist
    //         List<RendezVous> dermatologuePatients = rendezVousRepository.findByDermatologues(dermatologue.get());
    //         transformedDermatologueUserDTO.setDermatologuePatients(dermatologuePatients);

    //         return ResponseEntity.ok().body(transformedDermatologueUserDTO);
    //     } else {
    //         return ResponseEntity.notFound().build();
    //     }
    // }

    @GetMapping("/dermatologuePatients/{id}")
    public ResponseEntity<List<DermatologuePatientsDTO>> getDermatologuePatients(@PathVariable String id) {
        log.debug("REST request to get Dermatologue : {}", id);
        Optional<Dermatologue> dermatologue = dermatologueRepository.findById(id);

        if (dermatologue.isPresent()) {
            TransformedDermatologueUserDTO transformedDermatologueUserDTO = userService.findUserDermatologue(id);

            // Fetch and set the patients for the dermatologist
            List<RendezVous> dermatologuePatients = rendezVousRepository.findByDermatologues(dermatologue.get());
            Set<String> uniquePatientIds = new HashSet<>();

            // Construct a list of RendezVousDTO with the required structure
            List<DermatologuePatientsDTO> rendezVousDTOList = dermatologuePatients
                .stream()
                .map(rendezvous -> {
                    String patientId = rendezvous.getPatients().getId();
                    if (uniquePatientIds.add(patientId)) {
                        return mapRendezVousToDTOWithUser(rendezvous);
                    } else {
                        return null; // Skip duplicate patients
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

            // Set the transformed dermatologist user information
            // rendezVousDTOList.forEach(rendezvousDTO -> rendezvousDTO.getDermatologue().setUser(transformedDermatologueUserDTO.getUser()));

            return ResponseEntity.ok().body(rendezVousDTOList);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private DermatologuePatientsDTO mapRendezVousToDTOWithUser(RendezVous rendezvous) {
        DermatologuePatientsDTO rendezvousDTO = new DermatologuePatientsDTO();
        // rendezvousDTO.setId(rendezvous.getId());
        // rendezvousDTO.setDateDebut(rendezvous.getDateDebut());
        // rendezvousDTO.setDateFin(rendezvous.getDateFin());
        // rendezvousDTO.setStatut(rendezvous.getStatut());

        // Add the dermatologist's user to the RendezVousDTO
        // String dermatologueId = rendezvous.getDermatologues().getId();
        // TransformedDermatologueUserDTO transformedDermatologueUserDTO = userService.findUserDermatologue(dermatologueId);
        // rendezvousDTO.setDermatologue(transformedDermatologueUserDTO);

        // Add the patient's user to the RendezVousDTO
        rendezvousDTO.setPatient(rendezvous.getPatients());

        return rendezvousDTO;
    }

    //    @GetMapping("/dermatologues")
    //    public List<TransformedDermatologueUserDTO> getAllDermatologues() {
    //        log.debug("REST request to get all Dermatologues");
    ////        return dermatologueRepository.findAll();
    //        List<DermatologueUserDTO> list = new ArrayList<>();
    //        List<TransformedDermatologueUserDTO> response = new ArrayList<>();
    //        List<Dermatologue> liste = dermatologueRepository.findAll();
    //
    //
    //        for (Dermatologue d: liste){
    //            Optional<User> u = userRepository.findById(d.getId());
    //            DermatologueUserDTO dermatologueUserDTO = new DermatologueUserDTO();
    //            if (u.isPresent()){
    //                dermatologueUserDTO.setDermatologue(d);
    //                ManagedUserVM user = new ManagedUserVM();
    //                user.setFirstName(u.get().getFirstName());
    //                user.setLastName(u.get().getLastName());
    //                user.setEmail(u.get().getEmail());
    //                dermatologueUserDTO.setUser(user);
    //                dermatologueUserDTO.setUser(user);
    //
    //                list.add(dermatologueUserDTO);
    //            }
    //        }
    //
    //        for(DermatologueUserDTO d : list){
    //            response.add(new TransformedDermatologueUserDTO(d));
    //        }
    //
    //        return response;
    //    }

    /**
     * {@code GET  /dermatologues/:id} : get the "id" dermatologue.
     *
     * @param id the id of the dermatologue to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the dermatologue, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/dermatologues/{id}")
    public ResponseEntity<TransformedDermatologueUserDTO> getDermatologue(@PathVariable String id) {
        log.debug("REST request to get Dermatologue : {}", id);
        //        Optional<Dermatologue> dermatologue = dermatologueRepository.findById(id);
        TransformedDermatologueUserDTO transformedDermatologueUserDTO = userService.findUserDermatologue(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(transformedDermatologueUserDTO));
    }

    /**
     * {@code DELETE  /dermatologues/:id} : delete the "id" dermatologue.
     *
     * @param id the id of the dermatologue to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/dermatologues/{id}")
    public ResponseEntity<Void> deleteDermatologue(@PathVariable String id) {
        log.debug("REST request to delete Dermatologue : {}", id);

        Dermatologue dermatologue = dermatologueRepository.findById(id).get();
        List<RendezVous> rendezVous = rendezVousRepository.findByDermatologues(dermatologue);

        for (RendezVous r : rendezVous) {
            Consultation consultation = consultationRepository.findByRendezVous(r);
            List<Diagnostic> diagnostics = diagnosticRepository.findByConsultations(consultation);
            for (Diagnostic d : diagnostics) {
                diagnosticRepository.deleteById(d.getId());
            }
            consultationRepository.deleteById(consultation.getId());
            rendezVousRepository.deleteById(r.getId());
        }

        dermatologueRepository.deleteById(id);
        userRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }

    @PutMapping("/dermatologues/update/{id}")
    public List<Dermatologue> updateDermatologue(@RequestBody Dermatologue p) {
        Optional<Dermatologue> dermatologue = dermatologueRepository.findById(p.getId());
        if (dermatologue.isPresent()) {
            Dermatologue dermatologueFounded = dermatologue.get();
            dermatologueFounded.setTelephone(p.getTelephone());
            dermatologueFounded.setGenre(p.getGenre());
            dermatologueFounded.setCodeEmp(p.getCodeEmp());
            Optional<User> user = userRepository.findById(dermatologue.get().getId());
            user.get().setEmail(p.getUser().getEmail());
            user.get().setLastName(p.getUser().getLastName());
            user.get().setFirstName(p.getUser().getFirstName());
            dermatologueRepository.save(dermatologueFounded);
            userRepository.save(user.get());
        }
        return dermatologueRepository.findAll();
    }

    @GetMapping("/dermatologues/profile/{login}")
    public DermatologueUserDTO getProfile(@PathVariable String login) {
        Optional<User> user = userRepository.findOneByLogin(login);
        if (user.isPresent()) {
            Optional<Dermatologue> dermatologue = dermatologueRepository.findById(user.get().getId());
            if (dermatologue.isPresent()) {
                DermatologueUserDTO dermatologueUserDTO = new DermatologueUserDTO();
                dermatologueUserDTO.setDermatologue(dermatologue.get());
                ManagedUserVM managedUserVM = new ManagedUserVM();
                managedUserVM.setLastName(user.get().getLastName());
                managedUserVM.setFirstName(user.get().getFirstName());
                managedUserVM.setImageUrl(user.get().getImageUrl());
                dermatologueUserDTO.setUser(managedUserVM);
                return dermatologueUserDTO;
            }
            System.out.println(user.get().getFirstName());
            System.out.println(user.get().toString());
        }
        return null;
    }

    @GetMapping("/dermatologues/statistique-data/{login}")
    public List<Long> getData(@PathVariable String login) {
        Optional<User> user = userRepository.findOneByLogin(login);
        if (user.isPresent()) {}

        return null;
    }
}
