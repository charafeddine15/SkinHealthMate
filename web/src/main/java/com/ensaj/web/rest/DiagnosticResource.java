package com.ensaj.web.rest;

import com.ensaj.domain.*;
import com.ensaj.repository.DiagnosticRepository;
import com.ensaj.repository.MaladieRepository;
import com.ensaj.repository.UserRepository;
import com.ensaj.service.UserService;
import com.ensaj.service.dto.NewPatientUserDTO;
import com.ensaj.service.dto.PatientUserDTO;
import com.ensaj.service.dto.TransformedDermatologueUserDTO;
import com.ensaj.web.rest.errors.BadRequestAlertException;
//import jdk.jshell.Diag;

//import jdk.jshell.Diag;
import com.ensaj.web.rest.vm.ManagedUserVM;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZoneId;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.ensaj.domain.Diagnostic}.
 */
@RestController
@RequestMapping("/api/diagnostics")
public class DiagnosticResource {

    private final Logger log = LoggerFactory.getLogger(DiagnosticResource.class);

    private static final String ENTITY_NAME = "diagnostic";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DiagnosticRepository diagnosticRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public DiagnosticResource(DiagnosticRepository diagnosticRepository, UserService userService, UserRepository userRepository) {
        this.diagnosticRepository = diagnosticRepository;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    /**
     * {@code POST  /diagnostics} : Create a new diagnostic.
     *
     * @param diagnostic the diagnostic to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new diagnostic, or with status {@code 400 (Bad Request)} if the diagnostic has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Diagnostic> createDiagnostic(@RequestBody Diagnostic diagnostic) throws URISyntaxException {
        log.debug("REST request to save Diagnostic : {}", diagnostic);
        if (diagnostic.getId() != null) {
            throw new BadRequestAlertException("A new diagnostic cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Diagnostic result = diagnosticRepository.save(diagnostic);
        return ResponseEntity
            .created(new URI("/api/diagnostics/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    @PostMapping("/save")
    public ResponseEntity<Diagnostic> saveDiagnostic(@RequestBody Diagnostic diagnostic) throws URISyntaxException {
        log.debug("REST request to save Diagnostic : {}", diagnostic);
        if (diagnostic.getId() != null) {
            throw new BadRequestAlertException("A new diagnostic cannot already have an ID", ENTITY_NAME, "idexists");
        }

        System.out.println(diagnostic.getDateDiagnostic() + " Date Diagnostic");
        return null;
    }

    /**
     * {@code PUT  /diagnostics/:id} : Updates an existing diagnostic.
     *
     * @param id the id of the diagnostic to save.
     * @param diagnostic the diagnostic to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated diagnostic,
     * or with status {@code 400 (Bad Request)} if the diagnostic is not valid,
     * or with status {@code 500 (Internal Server Error)} if the diagnostic couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Diagnostic> updateDiagnostic(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Diagnostic diagnostic
    ) throws URISyntaxException {
        log.debug("REST request to update Diagnostic : {}, {}", id, diagnostic);
        if (diagnostic.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, diagnostic.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!diagnosticRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Diagnostic result = diagnosticRepository.save(diagnostic);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, diagnostic.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /diagnostics/:id} : Partial updates given fields of an existing diagnostic, field will ignore if it is null
     *
     * @param id the id of the diagnostic to save.
     * @param diagnostic the diagnostic to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated diagnostic,
     * or with status {@code 400 (Bad Request)} if the diagnostic is not valid,
     * or with status {@code 404 (Not Found)} if the diagnostic is not found,
     * or with status {@code 500 (Internal Server Error)} if the diagnostic couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Diagnostic> partialUpdateDiagnostic(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Diagnostic diagnostic
    ) throws URISyntaxException {
        log.debug("REST request to partial update Diagnostic partially : {}, {}", id, diagnostic);
        if (diagnostic.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, diagnostic.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!diagnosticRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Diagnostic> result = diagnosticRepository
            .findById(diagnostic.getId())
            .map(existingDiagnostic -> {
                if (diagnostic.getDateDiagnostic() != null) {
                    existingDiagnostic.setDateDiagnostic(diagnostic.getDateDiagnostic());
                }
                if (diagnostic.getPicture() != null) {
                    existingDiagnostic.setPicture(diagnostic.getPicture());
                }
                if (diagnostic.getPictureContentType() != null) {
                    existingDiagnostic.setPictureContentType(diagnostic.getPictureContentType());
                }
                if (diagnostic.getDescription() != null) {
                    existingDiagnostic.setDescription(diagnostic.getDescription());
                }
                if (diagnostic.getPrescription() != null) {
                    existingDiagnostic.setPrescription(diagnostic.getPrescription());
                }
                if (diagnostic.getProbability() != null) {
                    existingDiagnostic.setProbability(diagnostic.getProbability());
                }
                if (diagnostic.getMaladies() != null) {
                    existingDiagnostic.setMaladies(diagnostic.getMaladies());
                }

                return existingDiagnostic;
            })
            .map(diagnosticRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, diagnostic.getId())
        );
    }

    /**
     * {@code GET  /diagnostics} : get all the diagnostics.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of diagnostics in body.
     */
    @GetMapping("")
    public List<Diagnostic> getAllDiagnostics() {
        log.debug("REST request to get all Diagnostics");
        return diagnosticRepository.findAll();
    }

    //api dossier medical for a specific patient by dermatologue_id
    //    @GetMapping("/dermatologue/{id_dermatologue}/dossiermedical/patient/{id}")
    //    public List<Diagnostic> getAllDiagnosticsForMedicalRecord(@PathVariable String id_dermatologue, @PathVariable String id) {
    //        log.debug("REST request to get all Diagnostics");
    //        List<Diagnostic> diagnostics = diagnosticRepository.findAll();
    //        List<Diagnostic> data = new ArrayList<>();
    //        for (Diagnostic diagnostic : diagnostics) {
    //            Patient patient = diagnostic.getConsultations().getRendezVous().getPatients();
    //            Dermatologue dermatologue = diagnostic.getConsultations().getRendezVous().getDermatologues();
    //            if (patient.getId().equals(id) && dermatologue.getId().equals(id_dermatologue)) {
    //                Optional<User> user = userRepository.findById(patient.getUser().getId());
    //                PatientUserDTO patientUserDTO = new PatientUserDTO();
    //                ManagedUserVM managedUserVM = new ManagedUserVM();
    //                managedUserVM.setEmail(user.get().getEmail());
    //                managedUserVM.setFirstName(user.get().getFirstName());
    //                managedUserVM.setLastName(user.get().getLastName());
    //                patientUserDTO.setPatient(patient);
    //                diagnostic.setPatientUserDTO(patientUserDTO);
    //                data.add(diagnostic);
    //            }
    //        }
    //
    //        return data;
    //    }
    @GetMapping("/dermatologue/{id_dermatologue}/dossiermedical/patient/{id}")
    public List<Diagnostic> getAllDiagnosticsForMedicalRecord(@PathVariable String id_dermatologue, @PathVariable String id) {
        log.debug("REST request to get all Diagnostics");
        List<Diagnostic> diagnostics = diagnosticRepository.findAll();
        List<Diagnostic> data = new ArrayList<>();

        // Filter and sort diagnostics
        diagnostics
            .stream()
            .filter(diagnostic -> {
                Patient patient = diagnostic.getConsultations().getRendezVous().getPatients();
                Dermatologue dermatologue = diagnostic.getConsultations().getRendezVous().getDermatologues();
                return patient.getId().equals(id) && dermatologue.getId().equals(id_dermatologue);
            })
            .sorted(Comparator.comparing(diagnostic -> ((Diagnostic) diagnostic).getDateDiagnostic()).reversed())
            .forEach(diagnostic -> {
                Patient patient = diagnostic.getConsultations().getRendezVous().getPatients();
                Optional<User> user = userRepository.findById(patient.getUser().getId());
                PatientUserDTO patientUserDTO = new PatientUserDTO();
                ManagedUserVM managedUserVM = new ManagedUserVM();
                managedUserVM.setEmail(user.get().getEmail());
                managedUserVM.setFirstName(user.get().getFirstName());
                managedUserVM.setLastName(user.get().getLastName());
                patientUserDTO.setPatient(patient);
                diagnostic.setPatientUserDTO(patientUserDTO);
                data.add(diagnostic);
            });

        return data;
    }

    /**
     * {@code GET  /diagnostics/:id} : get the "id" diagnostic.
     *
     * @param id the id of the diagnostic to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the diagnostic, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Diagnostic> getDiagnostic(@PathVariable String id) {
        log.debug("REST request to get Diagnostic : {}", id);
        Optional<Diagnostic> diagnostic = diagnosticRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(diagnostic);
    }

    /**
     * {@code DELETE  /diagnostics/:id} : delete the "id" diagnostic.
     *
     * @param id the id of the diagnostic to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiagnostic(@PathVariable String id) {
        log.debug("REST request to delete Diagnostic : {}", id);
        diagnosticRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }

    //api dossier medical for a specific patient
    //    @GetMapping("/dossiermedical/patient/{id}")
    //    public List<Diagnostic> getAllPatientDiagnosticsForMedicalRecord(@PathVariable String id) {
    //        log.debug("REST request to get all Diagnostics");
    //        List<Diagnostic> diagnostics = diagnosticRepository.findAll();
    //        List<Diagnostic> data = new ArrayList<>();
    //        for (Diagnostic diagnostic : diagnostics) {
    //            Patient patient = diagnostic.getConsultations().getRendezVous().getPatients();
    //            String dermatologueId = diagnostic.getConsultations().getRendezVous().getDermatologues().getId();
    //            if (patient.getUser().getId().equals(id)) {
    //                Optional<User> user = userRepository.findById(patient.getUser().getId());
    //                NewPatientUserDTO newpatientUserDTO = new NewPatientUserDTO();
    //                //                PatientUserDTO patientUserDTO = new PatientUserDTO();
    //                ManagedUserVM managedUserVM = new ManagedUserVM();
    //                managedUserVM.setEmail(user.get().getEmail());
    //                managedUserVM.setFirstName(user.get().getFirstName());
    //                managedUserVM.setLastName(user.get().getLastName());
    //                //                patientUserDTO.setPatient(patient);
    //                newpatientUserDTO.setPatient(patient);
    //                TransformedDermatologueUserDTO transformedDermatologueUserDTO = userService.findUserDermatologue(dermatologueId);
    //                newpatientUserDTO.setDermatologue(transformedDermatologueUserDTO);
    //                //                newpatientUserDTO.setDermatologue(dermatologue);
    //                //                diagnostic.setPatientUserDTO(patientUserDTO);
    //                //                diagnostic.setNewPatientUserDTO();
    //                diagnostic.setNewPatientUserDTO(newpatientUserDTO);
    //                data.add(diagnostic);
    //            }
    //        }
    //        return data;
    //    }

    @GetMapping("/dossiermedical/patient/{id}")
    public List<Diagnostic> getAllPatientDiagnosticsForMedicalRecord(@PathVariable String id) {
        log.debug("REST request to get all Diagnostics");
        List<Diagnostic> diagnostics = diagnosticRepository.findAll();
        List<Diagnostic> data = new ArrayList<>();

        diagnostics
            .stream()
            .filter(diagnostic -> {
                Patient patient = diagnostic.getConsultations().getRendezVous().getPatients();
                String dermatologueId = diagnostic.getConsultations().getRendezVous().getDermatologues().getId();
                return patient.getUser().getId().equals(id);
            })
            .sorted(Comparator.comparing(diagnostic -> ((Diagnostic) diagnostic).getDateDiagnostic()).reversed())
            .forEach(diagnostic -> {
                Patient patient = diagnostic.getConsultations().getRendezVous().getPatients();
                String dermatologueId = diagnostic.getConsultations().getRendezVous().getDermatologues().getId();
                Optional<User> user = userRepository.findById(patient.getUser().getId());
                NewPatientUserDTO newpatientUserDTO = new NewPatientUserDTO();
                ManagedUserVM managedUserVM = new ManagedUserVM();
                managedUserVM.setEmail(user.get().getEmail());
                managedUserVM.setFirstName(user.get().getFirstName());
                managedUserVM.setLastName(user.get().getLastName());
                newpatientUserDTO.setPatient(patient);
                TransformedDermatologueUserDTO transformedDermatologueUserDTO = userService.findUserDermatologue(dermatologueId);
                newpatientUserDTO.setDermatologue(transformedDermatologueUserDTO);
                diagnostic.setNewPatientUserDTO(newpatientUserDTO);
                data.add(diagnostic);
            });

        return data;
    }

    @GetMapping("/consultations/{consultation_id}")
    public List<Diagnostic> getAllDiagnostics(@PathVariable String consultation_id) {
        List<Diagnostic> liste = diagnosticRepository.findAll();
        List<Diagnostic> data = new ArrayList<>();
        for (Diagnostic d : liste) {
            if (d.getConsultations().getId().equals(consultation_id)) {
                data.add(d);
            }
        }
        return data;
    }
}
