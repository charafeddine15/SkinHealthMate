package com.ensaj.web.rest;

import com.ensaj.domain.Stade;
import com.ensaj.repository.StadeRepository;
import com.ensaj.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.ensaj.domain.Stade}.
 */
@RestController
@RequestMapping("/api/stades")
public class StadeResource {

    private final Logger log = LoggerFactory.getLogger(StadeResource.class);

    private static final String ENTITY_NAME = "stade";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StadeRepository stadeRepository;

    public StadeResource(StadeRepository stadeRepository) {
        this.stadeRepository = stadeRepository;
    }

    /**
     * {@code POST  /stades} : Create a new stade.
     *
     * @param stade the stade to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new stade, or with status {@code 400 (Bad Request)} if the stade has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Stade> createStade(@RequestBody Stade stade) throws URISyntaxException {
        log.debug("REST request to save Stade : {}", stade);
        if (stade.getId() != null) {
            throw new BadRequestAlertException("A new stade cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Stade result = stadeRepository.save(stade);
        return ResponseEntity
            .created(new URI("/api/stades/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /stades/:id} : Updates an existing stade.
     *
     * @param id the id of the stade to save.
     * @param stade the stade to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stade,
     * or with status {@code 400 (Bad Request)} if the stade is not valid,
     * or with status {@code 500 (Internal Server Error)} if the stade couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Stade> updateStade(@PathVariable(value = "id", required = false) final String id, @RequestBody Stade stade)
        throws URISyntaxException {
        log.debug("REST request to update Stade : {}, {}", id, stade);
        if (stade.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stade.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stadeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Stade result = stadeRepository.save(stade);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, stade.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /stades/:id} : Partial updates given fields of an existing stade, field will ignore if it is null
     *
     * @param id the id of the stade to save.
     * @param stade the stade to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stade,
     * or with status {@code 400 (Bad Request)} if the stade is not valid,
     * or with status {@code 404 (Not Found)} if the stade is not found,
     * or with status {@code 500 (Internal Server Error)} if the stade couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Stade> partialUpdateStade(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Stade stade
    ) throws URISyntaxException {
        log.debug("REST request to partial update Stade partially : {}, {}", id, stade);
        if (stade.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stade.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stadeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Stade> result = stadeRepository
            .findById(stade.getId())
            .map(existingStade -> {
                if (stade.getStade() != null) {
                    existingStade.setStade(stade.getStade());
                }
                if (stade.getDescription() != null) {
                    existingStade.setDescription(stade.getDescription());
                }

                return existingStade;
            })
            .map(stadeRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, stade.getId()));
    }

    /**
     * {@code GET  /stades} : get all the stades.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of stades in body.
     */
    @GetMapping("")
    public List<Stade> getAllStades() {
        log.debug("REST request to get all Stades");
        return stadeRepository.findAll();
    }

    /**
     * {@code GET  /stades/:id} : get the "id" stade.
     *
     * @param id the id of the stade to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the stade, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Stade> getStade(@PathVariable String id) {
        log.debug("REST request to get Stade : {}", id);
        Optional<Stade> stade = stadeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(stade);
    }

    /**
     * {@code DELETE  /stades/:id} : delete the "id" stade.
     *
     * @param id the id of the stade to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStade(@PathVariable String id) {
        log.debug("REST request to delete Stade : {}", id);
        stadeRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
