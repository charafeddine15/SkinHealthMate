package com.ensaj.web.rest;

import com.ensaj.domain.Consultation;
import com.ensaj.domain.Diagnostic;
import com.ensaj.domain.RendezVous;
import com.ensaj.domain.User;
import com.ensaj.repository.ConsultationRepository;
import com.ensaj.repository.DiagnosticRepository;
import com.ensaj.repository.UserRepository;
import com.ensaj.service.UserService;
import com.ensaj.service.dto.*;
import com.ensaj.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;
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
 * REST controller for managing {@link com.ensaj.domain.Consultation}.
 */
@RestController
@RequestMapping("/api/consultations")
public class ConsultationResource {

    private final Logger log = LoggerFactory.getLogger(ConsultationResource.class);

    private static final String ENTITY_NAME = "consultation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ConsultationRepository consultationRepository;
    private final DiagnosticRepository diagnosticRepository;
    private final UserService userService;
    private final UserRepository userRepository;

    public ConsultationResource(
        ConsultationRepository consultationRepository,
        DiagnosticRepository diagnosticRepository,
        UserService userService,
        UserRepository userRepository
    ) {
        this.consultationRepository = consultationRepository;
        this.diagnosticRepository = diagnosticRepository;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    /**
     * {@code POST  /consultations} : Create a new consultation.
     *
     * @param consultation the consultation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new consultation, or with status {@code 400 (Bad Request)} if the consultation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Consultation> createConsultation(@RequestBody Consultation consultation) throws URISyntaxException {
        log.debug("REST request to save Consultation : {}", consultation);
        if (consultation.getId() != null) {
            throw new BadRequestAlertException("A new consultation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Consultation result = consultationRepository.save(consultation);
        return ResponseEntity
            .created(new URI("/api/consultations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /consultations/:id} : Updates an existing consultation.
     *
     * @param id the id of the consultation to save.
     * @param consultation the consultation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated consultation,
     * or with status {@code 400 (Bad Request)} if the consultation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the consultation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Consultation> updateConsultation(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Consultation consultation
    ) throws URISyntaxException {
        log.debug("REST request to update Consultation : {}, {}", id, consultation);
        if (consultation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, consultation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!consultationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Consultation result = consultationRepository.save(consultation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, consultation.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /consultations/:id} : Partial updates given fields of an existing consultation, field will ignore if it is null
     *
     * @param id the id of the consultation to save.
     * @param consultation the consultation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated consultation,
     * or with status {@code 400 (Bad Request)} if the consultation is not valid,
     * or with status {@code 404 (Not Found)} if the consultation is not found,
     * or with status {@code 500 (Internal Server Error)} if the consultation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Consultation> partialUpdateConsultation(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Consultation consultation
    ) throws URISyntaxException {
        log.debug("REST request to partial update Consultation partially : {}, {}", id, consultation);
        if (consultation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, consultation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!consultationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Consultation> result = consultationRepository
            .findById(consultation.getId())
            .map(existingConsultation -> {
                if (consultation.getDateConsultation() != null) {
                    existingConsultation.setDateConsultation(consultation.getDateConsultation());
                }

                return existingConsultation;
            })
            .map(consultationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, consultation.getId())
        );
    }

    /**
     * {@code GET  /consultations} : get all the consultations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of consultations in body.
     */
    // @GetMapping("")
    // public List<Consultation> getAllConsultations() {
    //     log.debug("REST request to get all Consultations");
    //     return consultationRepository.findAll();
    // }
    @GetMapping("")
    public List<ConsultationDTO> getAllConsultations() {
        log.debug("REST request to get all Consultations");

        List<Consultation> consultationList = consultationRepository.findAll();
        return consultationList
            .stream()
            .map(consultation -> {
                ConsultationDTO consultationDTO = new ConsultationDTO();
                consultationDTO.setId(consultation.getId());
                consultationDTO.setDateConsultation(consultation.getDateConsultation());

                RendezVousDTO rendezVousDTO = new RendezVousDTO();
                RendezVous rendezVous = consultation.getRendezVous();
                rendezVousDTO.setId(rendezVous.getId());
                rendezVousDTO.setDateDebut(rendezVous.getDateDebut());
                rendezVousDTO.setDateFin(rendezVous.getDateFin());
                rendezVousDTO.setStatut(rendezVous.getStatut());

                if (rendezVous.getDermatologues() != null) {
                    TransformedDermatologueUserDTO transformedDermatologueUserDTO = userService.findUserDermatologue(
                        rendezVous.getDermatologues().getId()
                    );
                    rendezVousDTO.setDermatologue(transformedDermatologueUserDTO);
                }

                rendezVousDTO.setPatient(rendezVous.getPatients());
                consultationDTO.setRendezVous(rendezVousDTO);

                return consultationDTO;
            })
            .collect(Collectors.toList());
    }

    //Liste des consultations par dermatologue
    @GetMapping("/listeConsultations/dematologue/{id}")
    public List<ConsultationDTOSimplifie> getAllConsultationsByDermatologueIDForToday(@PathVariable(value = "id") final String id) {
        log.debug("REST request to get all Consultations for dermatologist with ID: {}", id);

        Instant debutAujourdhui = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant debutDemain = LocalDate.now().plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        List<Consultation> consultationList = consultationRepository.findConsultationsForToday(debutAujourdhui, debutDemain);
        //
        //        List<Consultation> consultationList = consultationRepository.findAll();
        //        System.out.println(consultationList.size() + " est La taille de la liste de consultation pour" + id);

        return consultationList
            .stream()
            .filter(consultation -> {
                RendezVous rendezVous = consultation.getRendezVous();
                return rendezVous != null && rendezVous.getDermatologues() != null && rendezVous.getDermatologues().getId().equals(id);
            })
            .map(consultation -> {
                ConsultationDTOSimplifie consultationDTO = new ConsultationDTOSimplifie();
                consultationDTO.setId(consultation.getId());
                consultationDTO.setDateConsultation(consultation.getDateConsultation());
                //                DermatologueConsultations

                DermatologueConsultations rendezVousDTO = new DermatologueConsultations();
                RendezVous rendezVous = consultation.getRendezVous();
                rendezVousDTO.setId(rendezVous.getId());
                rendezVousDTO.setDateDebut(rendezVous.getDateDebut());
                rendezVousDTO.setDateFin(rendezVous.getDateFin());
                rendezVousDTO.setStatut(rendezVous.getStatut());

                TransformedDermatologueUserDTO transformedDermatologueUserDTO = userService.findUserDermatologue(
                    rendezVous.getDermatologues().getId()
                );
                //                rendezVousDTO.setDermatologue(transformedDermatologueUserDTO);

                rendezVousDTO.setPatient(rendezVous.getPatients());
                consultationDTO.setRendezVous(rendezVousDTO);

                return consultationDTO;
            })
            .collect(Collectors.toList());
    }

    /**
     * {@code GET  /consultations/:id} : get the "id" consultation.
     *
     * @param id the id of the consultation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the consultation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Consultation> getConsultation(@PathVariable String id) {
        log.debug("REST request to get Consultation : {}", id);
        Optional<Consultation> consultation = consultationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(consultation);
    }

    /**
     * {@code DELETE  /consultations/:id} : delete the "id" consultation.
     *
     * @param id the id of the consultation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConsultation(@PathVariable String id) {
        log.debug("REST request to delete Consultation : {}", id);
        List<Diagnostic> liste = diagnosticRepository.findAll();
        for (Diagnostic d : liste) {
            if (d.getConsultations().getId().equals(id)) {
                diagnosticRepository.deleteById(d.getId());
            }
        }
        consultationRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }

    @GetMapping("/all-Consultations/dematologue/{id}")
    public List<ConsultationDTOSimplifie> getAllConsultationsByDermatologueID(@PathVariable(value = "id") final String id) {
        log.debug("REST request to get all Consultations for dermatologist with ID: {}", id);

        List<Consultation> consultationList = consultationRepository.findAll();

        return consultationList
            .stream()
            .filter(consultation -> {
                RendezVous rendezVous = consultation.getRendezVous();
                return rendezVous != null && rendezVous.getDermatologues() != null && rendezVous.getDermatologues().getId().equals(id);
            })
            .map(consultation -> {
                ConsultationDTOSimplifie consultationDTO = new ConsultationDTOSimplifie();
                consultationDTO.setId(consultation.getId());
                consultationDTO.setDateConsultation(consultation.getDateConsultation());
                //                DermatologueConsultations

                DermatologueConsultations rendezVousDTO = new DermatologueConsultations();
                RendezVous rendezVous = consultation.getRendezVous();
                rendezVousDTO.setId(rendezVous.getId());
                rendezVousDTO.setDateDebut(rendezVous.getDateDebut());
                rendezVousDTO.setDateFin(rendezVous.getDateFin());
                rendezVousDTO.setStatut(rendezVous.getStatut());

                TransformedDermatologueUserDTO transformedDermatologueUserDTO = userService.findUserDermatologue(
                    rendezVous.getDermatologues().getId()
                );
                //                rendezVousDTO.setDermatologue(transformedDermatologueUserDTO);

                rendezVousDTO.setPatient(rendezVous.getPatients());
                consultationDTO.setRendezVous(rendezVousDTO);

                return consultationDTO;
            })
            .collect(Collectors.toList());
    }

    @GetMapping("/listeConsultations/dermato/{username}")
    public List<ConsultationDTOSimplifie> getAllConsultationsByDermatologueUsernameForToday(@PathVariable String username) {
        log.debug("REST request to get all Consultations for dermatologist with ID: {}", username);

        Instant debutAujourdhui = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant debutDemain = LocalDate.now().plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        List<Consultation> consultationList = consultationRepository.findConsultationsForToday(debutAujourdhui, debutDemain);

        Optional<User> user = userRepository.findOneByLogin(username);
        if (user.isPresent()) {
            return consultationList
                .stream()
                .filter(consultation -> {
                    RendezVous rendezVous = consultation.getRendezVous();
                    return (
                        rendezVous != null &&
                        rendezVous.getDermatologues() != null &&
                        rendezVous.getDermatologues().getId().equals(user.get().getId())
                    );
                })
                .map(consultation -> {
                    ConsultationDTOSimplifie consultationDTO = new ConsultationDTOSimplifie();
                    consultationDTO.setId(consultation.getId());
                    consultationDTO.setDateConsultation(consultation.getDateConsultation());
                    //                DermatologueConsultations

                    DermatologueConsultations rendezVousDTO = new DermatologueConsultations();
                    RendezVous rendezVous = consultation.getRendezVous();
                    rendezVousDTO.setId(rendezVous.getId());
                    rendezVousDTO.setDateDebut(rendezVous.getDateDebut());
                    rendezVousDTO.setDateFin(rendezVous.getDateFin());
                    rendezVousDTO.setStatut(rendezVous.getStatut());

                    TransformedDermatologueUserDTO transformedDermatologueUserDTO = userService.findUserDermatologue(
                        rendezVous.getDermatologues().getId()
                    );
                    //                rendezVousDTO.setDermatologue(transformedDermatologueUserDTO);

                    rendezVousDTO.setPatient(rendezVous.getPatients());
                    consultationDTO.setRendezVous(rendezVousDTO);

                    return consultationDTO;
                })
                .collect(Collectors.toList());
        }
        return null;
    }
}
